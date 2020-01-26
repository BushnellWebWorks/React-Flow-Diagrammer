import React from 'react';
import ReactDOM from 'react-dom';
import './styles.css'
import ChatDiagram from './inc/ChatDiagram';
//import registerServiceWorker from './registerServiceWorker';

let blueNodes = (window.masterPlan && window.masterPlan.blueprint) ? window.masterPlan.blueprint[0].nodes : [];
const diagramStartKey = (window.masterPlan && window.masterPlan.start) ?  window.masterPlan.start : null;
let blueStartGroup = (window.masterPlan && window.masterPlan.startGroup ) ? window.masterPlan.startGroup : null;

const deployDiagram = (changed) => {
  ReactDOM.render(<ChatDiagram nodes={blueNodes} startKey={diagramStartKey} startGroup={blueStartGroup} changed={(changed==true)? true:false} />, document.getElementById('tree-diagram'));
}

window.addEventListener('load', deployDiagram);
window.addEventListener('chatdataupdated', ()=>{
  deployDiagram( true );
});
//registerServiceWorker();
