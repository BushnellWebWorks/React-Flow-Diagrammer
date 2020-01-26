let displayStack = {};
let stackIndex = 0;
let stackRef = [];
let lineQueue = [];

const buildDisplayStack = ( nodes, entryNode ) => {

  stackIndex = 0;
  stackRef = [];
  lineQueue = [];
  displayStack = Object.assign( {}, nodes );
  if ( !displayStack[ entryNode ] ) { return new Error('Entry point not defined.') }
  const qResult = buildQueue( entryNode, displayStack[entryNode].nextNodes );
  if ( qResult instanceof Error ) { return qResult; }
  runQueue();
  return displayStack;
}

const buildQueue = (nodeId, nextNodeIds) => {
  const startIndex = getStackIx( nodeId );
  if ( displayStack[ nodeId ].inQueue ) { return false; }
  displayStack[ nodeId ].inQueue = true;
  for ( const nextNodeId of nextNodeIds ) {
    if ( !nextNodeId ) { continue; }
    const nextIndex = getStackIx( nextNodeId )
    if ( false === nextIndex ) {
      console.error(`ERROR: ${nextNodeId}, assigned in ${nodeId}, is not part of the display stack.`);
      continue;
    }
    if ( !lineQueue.some( lineOb => (lineOb.start === nodeId && lineOb.dest === nextNodeId ) ) ) {
      lineQueue.push( {start: nodeId, dest: nextNodeId, startIndex, nextIndex} );
    }
    buildQueue( nextNodeId, displayStack[nextNodeId].nextNodes ); // recursive!
  }
  return true;
}

const runQueue = () => {
  for ( const ll of lineQueue ) {
    processQueueItem( ll );
  }
}

const processQueueItem = ( ll ) => {
  let occuLane = 0;
  const { startIndex, nextIndex } = ll;
  const sProp = ( nextIndex > startIndex ) ? 'occuLanesBelow' : 'occuLanesAbove';
  const nProp = ( nextIndex > startIndex ) ? 'occuLanesAbove' : 'occuLanesBelow';
  occuLane = occuLane | stackRef[startIndex][sProp] | stackRef[nextIndex][nProp];
  for ( let ix = Math.min( startIndex, nextIndex )+1; ix < Math.max( startIndex, nextIndex ); ix++ ) {
    occuLane = occuLane | stackRef[ix].occuLanesAbove | stackRef[ix].occuLanesBelow;
  }
  let lowestAvailableLane = ( ~occuLane & -~occuLane );
  if ( lowestAvailableLane === 1 && Math.abs( nextIndex-startIndex) > 1 ) {
    lowestAvailableLane = 2;
  }
  stackRef[startIndex][sProp] |= lowestAvailableLane;
  stackRef[nextIndex][nProp] |= lowestAvailableLane;
  for ( let ix = Math.min( startIndex, nextIndex )+1; ix < Math.max( startIndex, nextIndex ); ix++ ) {
    stackRef[ix].occuLanesAbove |= lowestAvailableLane;
    stackRef[ix].occuLanesBelow |= lowestAvailableLane;
  }
  displayStack[ ll.start ].lines = displayStack[ ll.start ].lines || [];
  displayStack[ ll.start ].lines.push( {startIndex, nextIndex, lane: lowestAvailableLane.toString(2).length-1} );

}

const getStackIx = nodeId => {
  if ( !displayStack[ nodeId ] ) { return false; }
  if ( 'undefined' === typeof displayStack[ nodeId ].index ) {
    stackRef[ stackIndex ] = {id:nodeId, occuLanesAbove: 0, occuLanesBelow: 0};
    displayStack[ nodeId ].index = stackIndex++;
  }
  return displayStack[ nodeId ].index;
}

export default buildDisplayStack;
