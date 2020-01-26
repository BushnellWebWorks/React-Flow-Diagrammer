import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css'
import FlowDiagram from './inc/FlowDiagram';
//import registerServiceWorker from './registerServiceWorker';

let blueNodes = (window.masterPlan && window.masterPlan.blueprint) ? window.masterPlan.blueprint[0].nodes : {};
const diagramStartKey = (window.masterPlan && window.masterPlan.start) ?  window.masterPlan.start : null;
let blueStartGroup = (window.masterPlan && window.masterPlan.startGroup ) ? window.masterPlan.startGroup : null;

const deployDiagram = (changed) => {
  ReactDOM.render(<FlowDiagram nodes={blueNodes} startKey={diagramStartKey} startGroup={blueStartGroup} />, document.getElementById('tree-diagram'));
}

window.addEventListener('load', deployDiagram);
window.addEventListener('chatdataupdated', ()=>{
  deployDiagram( true );
});
//registerServiceWorker();
