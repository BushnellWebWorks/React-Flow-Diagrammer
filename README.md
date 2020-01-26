# React-Flow-Diagrammer

![Flow Diagram Screenshot](https://github.com/BushnellWebWorks/React-Flow-Diagrammer/blob/master/public/readme_hero.png?raw=true)

Takes a JSON object where nodes are interconnected through "exits," and visually diagrams the flow. This was originally created as part of a chat client project, where exits were routed according to user responses to questions.

## Usage

The main component, FlowDiagram, takes three attributes:

+ `nodes`: An object consisting of `[key]: {node}` properties. Nodes are described below.
+ `startKey`: The key of the entry node.
+ `startGroup` (optional): The starting display group, defaults to the root view.

View the included sample_json.js for a sample structure of the `{nodes}` object. (It's wrapped in an object named 'masterPlan.blueprint' just for demo purposes.)

+ `tag`: String matching the node's key in the {nodes} object.
+ `type`: At this time, two node types are supported: 'decision' and 'action'.
+ `label`: The node title displayed in the diagram.
+ `groupID`: Nodes can be grouped for better clarity in the diagram. A group of nodes is shown as a folder icon.
+ `exits`: An array of objects, each containing a `tag` property matching another node.