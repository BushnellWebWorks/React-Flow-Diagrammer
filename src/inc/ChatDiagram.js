import React, {Component} from 'react';
import buildDisplayStack from './diagram/display'
import { addLine } from './diagram/draw'
import DiagramIcon from './DiagramIcon';

const chartSpecs = {
  w: 900,
  marginY: 50,
  nodeWidth: 220,
  nodeHeight: 150,
  laneGap: 30,
  iconWidth: 60,
  iconHeight: 60
};

const diagramIconsStyle = {
  width: `${chartSpecs.w}px`,
  left: `calc(50% - ${Math.floor( chartSpecs.w/2 )}px)`
}

class ChatDiagram extends Component {
	constructor( props ) {
		super(props);
		this.el = {}
		this.state = {
      displayStack:{},
      clickMode: null,
      selectedNodes: [],
    };
    this.province = {
      nodes: {},
      startKey: props.startKey,
      startGroup: props.startGroup || null,
      mustRefresh: false, // set when props have changed (e.g. data updated)
      groupTree:{}, // lookup table to help diagram display
      alreadySeen: [], //helper to avoid infinite recursion
    };
		this.cvs = null;
		this.ctx = null;
		this.addLines = this.addLines.bind(this);
		this.diagramDigest = this.diagramDigest.bind(this);
    this.toggleGroupMode = this.toggleGroupMode.bind(this);
    this.handleNodeClick = this.handleNodeClick.bind(this);
    this.nodeIsChecked = this.nodeIsChecked.bind(this);
    this.findStartKey = this.findStartKey.bind(this);
    this.digestAndDisplay = this.digestAndDisplay.bind(this);
    this.handleCommitClick = this.handleCommitClick.bind(this);
    this.groupOrUngroup = this.groupOrUngroup.bind(this);
    this.clearClickMode = this.clearClickMode.bind(this);
    this.copyPropNodes = this.copyPropNodes.bind(this);
    this.buildGroupTree = this.buildGroupTree.bind(this);
    this.gidIsInGroup = this.gidIsInGroup.bind(this);
    this.recursiveGroupDive = this.recursiveGroupDive.bind(this);
	}

	componentDidMount() {
		this.ctx = this.cvs.getContext('2d');
    if ( window) {
      window.chatDiagramData = {};
    }
    this.copyPropNodes();
    this.digestAndDisplay( this.province.startGroup || null );
	}

  // digestAndDisplay relies on component data to build the digest and set the state.
  // The hack is to set a boolean mustRefresh, so the component updates after digestAndDisplay sets the state.
  shouldComponentUpdate( nextProps, nextState ) {
    // ugh ... sorry about the overhead but we have to determine if we're here because of a props change or state change.
    if ( JSON.stringify( nextProps.nodes ) != JSON.stringify(this.province.nodes) ) {
      if ( !this.province.mustRefresh ) {
        this.province.mustRefresh = true;
        this.digestAndDisplay( this.province.startGroup );
        return false;
      }
    }
    return true;
  }

  componentDidUpdate() {
    // if mustRefresh, then component updated because of a props change, so turn off Group Mode.
    if ( this.province.mustRefresh ) {
      this.province.mustRefresh = false;
      this.copyPropNodes();
      this.clearClickMode();
    }
  }

  clearClickMode( cb ) {
    this.setState({
      clickMode: null,
      selectedNodes:[]
    }, () => {
      if ( cb ) { cb() }
    })
  }

  copyPropNodes() {
    this.province.nodes = {};
    for ( const key of Object.keys(this.props.nodes) ) {
      this.province.nodes[ key ] = {...this.props.nodes[key] };
    }
  }

  digestAndDisplay( groupKey=null, dontSetState=false ) {
    const digest = this.diagramDigest( groupKey );
    let {startKey} = this.province;

    if ( (Object.keys(digest).length && !startKey) || undefined === digest[ startKey ] ) {
      startKey = Object.keys(digest)[0];
    }
    let displayStack ={};
    if ( digest && Object.keys(digest).length ) {
      displayStack = buildDisplayStack( digest, startKey );
    }
    if ( dontSetState ) {
      return displayStack;
    }
  	this.setState( {
      displayStack,
    }, () => requestAnimationFrame( this.addLines ) );
  }

	addLines() {
		const {displayStack} = this.state;
    if ( !displayStack ) { return; }
		for ( const nid of Object.keys( displayStack) ) {
			if ( !displayStack[nid].lines ) { continue; }
			for ( const lob of displayStack[nid].lines ) {
				addLine( lob, this.ctx, chartSpecs );
			}
		}
	}

  handleNodeClick( ev, id ) {
    let {selectedNodes} = this.state;
    switch( this.state.clickMode ) {
      case 'group': {
        if ( selectedNodes.indexOf(id) < 0 ) {
          selectedNodes.push( id );
        } else {
          selectedNodes = selectedNodes.filter( iid => ( iid != id ) );
        }
        this.setState({selectedNodes}, () => {
          if ( window && window.chatDiagramData ) {
            window.chatDiagramData.selectedNodes = this.state.selectedNodes;
          }
        });
        break;
      }
      case 'edit':
      default: {
        if ( ev.target.tagName.toLowerCase() == 'label' || ev.target.tagName.toLowerCase() == 'input' ) { return; }
        const clickedNode = this.state.displayStack[id];
        if ( clickedNode && clickedNode.type ) {
          switch( clickedNode.type ) {
            case 'subChat':
              this.province.startGroup = id.substring(1);
              this.clearClickMode( () => { this.digestAndDisplay( this.province.startGroup ) } );
            break;

            case 'decision':
            case 'action':
            default:
              // Do something here when tree node is clicked. Maybe set route to detail view page?
              console.log(id);
              console.log(this.state.displayStack[id]);
            break;
          }
        }
        break;
      }
    }
  }

  toggleGroupMode(ev) {
    this.setState({clickMode: (this.state.clickMode == 'group') ? null : 'group'})
  }

  handleCommitClick(ev) {
    if ( window && window.diagramCheckboxAction ) {
      if ( this.groupOrUngroup() ) {
        window.diagramCheckboxAction('group');
      } else {
        window.diagramCheckboxAction('ungroup', {groupID: this.province.startGroup} );
      }
    } else {
      console.log('these nodes are selected:');
      console.log(this.state.selectedNodes);
    }
  }

  // if selection should be grouped, then returns true, if ungrouped then false
  groupOrUngroup() {
    let gorug = true;
    if ( !( this.state.selectedNodes instanceof Array ) ) { return true; }
    for ( const id of this.state.selectedNodes ) {
      if ( id[0] == '@' ) {
        gorug = false;
        break;
      }
    }
    return gorug;
  }

  buildGroupTree( nodes, startKey ) {
    let groupTree = { __root: {} }

    // groupTree s/b initted with __root already defined
    // every top-level group prop will also contain @__root = ref to top-level __root
    const addNodeToGroupTree = (gid, node) => {
      if ( !gid ) { gid = '__root'; }
      if ( !groupTree[gid] ) {
        groupTree[gid] = {
          "@__root": groupTree.__root
        };
      }
      groupTree[ gid ][ node.tag ] = node;
    }

    let nidStack = [ startKey ];
    let processedStack = [];
    while ( nidStack.length ) {
      let thisNid = nidStack.shift();
      processedStack.push( thisNid );
      const node = nodes[ thisNid ];
      if ( !node || !(node instanceof Object) ) { continue; }
      if ( !(node.exits instanceof Array) || !node.exits.length ) { continue; }
      const groupID = ( node.groupID ) ? node.groupID : '__root';
      addNodeToGroupTree( groupID, node );

      for ( const exitRef of node.exits ) {
        if ( processedStack.indexOf( exitRef.tag ) >= 0 ) { continue; }
        nidStack.push( exitRef.tag );
        const nextNode = nodes[ exitRef.tag ];
        if ( !nextNode || !(nextNode instanceof Object) ) { continue; }
        const nextGroupID = ( nextNode.groupID ) ? nextNode.groupID : '__root';
        addNodeToGroupTree( nextGroupID, nextNode );
        if ( groupID != nextGroupID ) {
          groupTree[ groupID ][ `@${nextGroupID}` ] = groupTree[ nextGroupID ];
        }
      }

    }
    this.province.groupTree = groupTree;
  }

  // look for gid in an array of gids (without @prefix); returns appropriate containing gid, null if not found, or false if error
  gidIsInGroup(gid,gids) {
    if ( !( gids instanceof Array ) ) { return false; }
    if ( gids.indexOf(gid) >= 0 ) { return gid; }
    for ( const g of gids ) {
      const treeItem = this.province.groupTree[g];
      if ( !treeItem ) { return false; }
      this.province.alreadySeen = ['__root'];
      if ( this.recursiveGroupDive( gid, treeItem ) ) { return g; }
    }
    return null;
  }
  // recursive part of the above gidIsInGroups
  recursiveGroupDive(gid, treeOb) {
    const groupKeys = Object.keys( treeOb ).map( key => {
      if ( key[0] != '@' ) { return; }
      return key.substring(1);
    }).filter( key => (key && key != '__root') );
    for ( const groupKey of groupKeys ) {
      if ( gid === groupKey ) { return true; }
      if ( this.province.alreadySeen.indexOf( groupKey ) < 0 ) {
        this.province.alreadySeen.push( groupKey );
        return this.recursiveGroupDive( gid, treeOb[`@${groupKey}`]);
      }
    }
    return false;
  }

  diagramDigest( displayingGroup ) {
    this.buildGroupTree( this.props.nodes, this.props.startKey );
    const subGroupDigestNode = (label, visible) => {
      if ( label == '__root' ) { label = '[Main]' }
      return {
        label,
        type: 'subChat',
        nextNodes:[],
        visible
      }
    };

    let digest = {};

    const addNextNode = ( srcKey, nextTag ) =>  {
      if ( srcKey == nextTag ) { return; }
      if ( digest[ srcKey ].nextNodes.indexOf( nextTag ) >= 0 ) { return; }
      digest[ srcKey ].nextNodes.push( nextTag );
    }

    let nodes = this.props.nodes || {};
    if ( undefined === displayingGroup || null === displayingGroup || '__root' === displayingGroup ) {
      displayingGroup = '__root';
    }
    const displayingTags = Object.keys( this.province.groupTree[ displayingGroup ] );
    const displayingGroupKeys = displayingTags.map( key => {
      // while we're looping, build the digest...
      if ( key[0] == '@' ) {
        digest[key] = subGroupDigestNode(key.substring(1),true)
      } else if ( nodes[key] ) {
        digest[key] = {
          label: nodes[key].label,
          type: nodes[key].type,
          nextNodes:[],
          visible:true,
        }
      }
      if ( key[0] != '@' ) { return; }
      return key.substring(1);
    }).filter( key => key );
    let nodeTags = Object.keys( nodes ); // using array nodeTags, loop continues if new keys are added

    for ( const keyTag of nodeTags ) {
      const kNode = nodes[keyTag];
      if ( !kNode || !kNode.exits ) { continue; }
      // let nextNodes = [];
      let visible = false;

      let sourceKey;
      if ( displayingTags.indexOf( keyTag ) >= 0 ) { // node is in our current group
        visible = true;
        sourceKey = keyTag;
      } else { // node is not in our current group, so point to container group / _root.
        const thisGroupID = kNode.groupID || '__root';
        const findGroups = displayingGroupKeys.filter( key => (key != '__root') );
        const foundContainer = this.gidIsInGroup( thisGroupID , findGroups ) || '__root';
        if ( displayingGroup == '__root' && foundContainer == '__root' ) { // unconnected node, in root view, so add to digest
          sourceKey = keyTag;
          digest[keyTag] = {
            label: nodes[keyTag].label,
            type: nodes[keyTag].type,
            nextNodes:[],
            visible:true,
          }

        } else {
          sourceKey = `@${foundContainer}`;
        }
      }

      for ( const cRef of kNode.exits ) {
        if ( !cRef.tag || !nodes[cRef.tag] ) { continue; }
        const nextGroupID = nodes[cRef.tag].groupID || '_root';
        if ( displayingTags.indexOf(cRef.tag) >=0 ) { // node is in current display group
          addNextNode( sourceKey, cRef.tag );
        } else if ( displayingTags.indexOf(`@${nextGroupID}`) >= 0 ) { // node is in group in current display group
          addNextNode( sourceKey, `@${nextGroupID}` );
        } else { // node is buried in a group somewhere
          const findGroups = displayingGroupKeys.filter( key => (key != '__root') );
          const foundContainer = this.gidIsInGroup( nextGroupID , findGroups ) || '__root';
          addNextNode( sourceKey, `@${foundContainer}` );
        }
      }
    }

    const newStartKey = this.findStartKey(digest);
    if ( newStartKey ) {
      this.province.startKey = newStartKey;
    }
    return digest;
  }

  // starting with root startKey, ferret thru exit nodes until we match at one that's in our digest.
  findStartKey( digest ) {
    if ( !this.props.startKey ) { return null; }
    const digestKeys = Object.keys(digest);
    const keySequence = [this.props.startKey];
    for ( const ikey of keySequence ) {
      if ( digestKeys.indexOf( ikey ) >= 0 ) {
        return ikey;
      }
      const inode = this.province.nodes[ikey];
      if ( inode.groupID && digestKeys.indexOf( `@${inode.groupID}` ) >=0 ) {
        return `@${inode.groupID}`;
      } else if ( !inode.groupID && digestKeys.indexOf( '@__root' ) >= 0 ) {
        return '@__root';
      }
      if ( !inode || !inode.exits ) { continue; }
      inode.exits.map( ex => {
        if ( keySequence.indexOf( ex.tag ) < 0 ) {
          keySequence.push( ex.tag );
        }
      })
    }
    return null;
  }

  nodeIsChecked( nid ) {
    if ( !this.state.clickMode ) { return false; }
    if ( this.state.selectedNodes.indexOf( nid ) <0 ) { return false; }
    return true; //<div className="node-checkmark" />
  }

	render() {
		const canvasHeight = Object.keys( this.state.displayStack ).length * chartSpecs.nodeHeight + 2 * chartSpecs.marginY;
		const { displayStack } = this.state;
		let unconnected = {};
		let unconnOffset = 0;
    if ( !displayStack ) {
      return <div className="diagramContain" />
    }
    const groupActionLabel = (this.groupOrUngroup()) ? 'Group selected items' : 'Ungroup';
		return (
			<div className={`diagramContain clickMode-${this.state.clickMode}`}>
				<canvas ref={ el => {this.cvs = el} } width={chartSpecs.w} height={canvasHeight} />
				<div className="diagramIcons" style={diagramIconsStyle}>
        { Object.keys( displayStack ).map( (nid,ix) => {
					if ( 'undefined' === typeof ( displayStack[nid].index ) ) {
						unconnected[nid] = displayStack[nid];
						return null;
					}
					unconnOffset++;
					const x = chartSpecs.w/2;
          const y = displayStack[nid].index * chartSpecs.nodeHeight + chartSpecs.marginY;
          return <DiagramIcon
            stackItem={displayStack[nid]}
            id={nid}
            handleClick={this.handleNodeClick}
            x={x} y={y}
            checked={this.nodeIsChecked(nid)}
            key={`connex${nid}`}
          />
        } )}
				{ Object.keys( unconnected ).map( (nid,ix) => {
          const x = chartSpecs.w/2;
					const y = ( unconnOffset + ix ) * chartSpecs.nodeHeight + chartSpecs.marginY;
          return <DiagramIcon
            stackItem={unconnected[nid]}
            id={nid}
            handleClick={this.handleNodeClick}
            x={x} y={y}
            checked={this.nodeIsChecked(nid)}
            key={`unconnex${nid}`}
          />

				})}
				</div>
        <div className="clickMode-container">
          {( !this.province.startGroup || this.province.startGroup == '__root' ) ? '' : <div className="breadcrumbs">
            {this.province.startGroup}<br />
            <a href="#0" onClick={ ev => {
              ev.preventDefault();
              this.province.startGroup = null;
              this.digestAndDisplay( this.province.startGroup );
            }}>&lt; Back to top</a></div> }
          <div className={`clickMode-button clickMode-group ${(this.state.clickMode=='group') ? 'clickMode-group-active' : ''}`} onClick={this.toggleGroupMode}>Group Mode</div>
          {(this.state.clickMode=='group') ? <button type="button" onClick={this.handleCommitClick}>{groupActionLabel}</button> : null }
        </div>
			</div>
		)
	}

}
export default ChatDiagram;
