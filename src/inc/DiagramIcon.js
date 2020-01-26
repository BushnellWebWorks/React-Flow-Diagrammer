import React, {Component} from 'react';

class DiagramIcon extends Component {
  constructor( props ) {
    super(props);
    this.checkmark = this.checkmark.bind(this);
  }
  iconLabel( labelText ) {
    if ( !labelText ) {
      return '';
    }
    const shortened = ( (labelText.length > 20) ? labelText.substr(0,20) + '…' : labelText );
    return (
      <div className="icon-label" dangerouslySetInnerHTML={{__html:shortened}} />
    )
  }

  checkmark() {
    return (this.props.checked) ? <div className="node-checkmark" /> : null;
  }

  render() {
    const {stackItem,id,handleClick,x,y} = this.props;
    let nodeType, faIcon;
    switch( stackItem.type ) {
      case 'action':
        nodeType = 'action';
        faIcon = 'fa-link';
        break;
      case 'subChat':
        nodeType = 'subchat';
        faIcon = 'fa-folder-open';
        break;
      //case 'decision':
      default:
        nodeType = 'decision';
        faIcon = 'fa-map-signs';
        break;
    }
    return (
      <div key={`${nodeType}{id}`}
        onClick = {ev => handleClick( ev, id) }
        className="node-container"
        style={{ left: x, top: y }}>
        <div  className={`flow-icon-shape flow-icon-shape-${nodeType}`}>
          <i className={`flow-icon fas ${faIcon} fa-2x`}></i>
        </div>
        {this.iconLabel(stackItem.label)}
        {this.checkmark()}
      </div>
    )
  }

}

export default DiagramIcon;
