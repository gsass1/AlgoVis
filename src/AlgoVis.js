import Interpreter from 'js-interpreter'

import Constants from './Constants';
import Graph from './Graph';
import List from './List';
import Position from './Position';
import Queue from './Queue';
import Tree from './Tree';
import Util from './Util';

const getTreeFromNodeRef = ref => {
  return String(ref).split("-")[0];
}

const getGraphFromRef = ref => {
  return String(ref).split("-")[0];
}

const createInterpreter = (algovis, code) => {
  return new Interpreter(code, (interp, scope) => {
    interp.setProperty(scope, 'log', interp.createNativeFunction((msg) => {
      console.log(msg);
    }));

    interp.setProperty(scope, 'hint', interp.createNativeFunction((msg) => {
      algovis.setHint(msg.data);
    }));

    interp.setProperty(scope, 'debugbreak', interp.createNativeFunction((asdasd) => {
      algovis.togglePause();

      console.log(algovis.objects);
    }));

    /* List functions */
    interp.setProperty(scope, 'listCreate', interp.createNativeFunction((name, size) => {
      algovis.addObject(new List({name: name.data, size: size.data}));
      return name;
    }));

    interp.setProperty(scope, 'listGet', interp.createNativeFunction((name, i) => {
      return interp.createPrimitive(algovis.getObject(name.data).get(i));
    }));

    interp.setProperty(scope, 'listSet', interp.createNativeFunction((name, i, value) => {
      algovis.getObject(name.data).set(i, value);
    }));

    interp.setProperty(scope, 'listSwap', interp.createNativeFunction((name, a, b) => {
      algovis.getObject(name.data).swap(a, b);
    }));

    interp.setProperty(scope, 'listAdd', interp.createNativeFunction((name, value) => {
      algovis.getObject(name.data).add(value.data);
    }));

    interp.setProperty(scope, 'listSize', interp.createNativeFunction((name, value) => {
      return interp.createPrimitive(algovis.getObject(name.data).size);
    }));

    interp.setProperty(scope, 'listLength', interp.createNativeFunction((name) => {
      return interp.createPrimitive(algovis.getObject(name.data).size);
    }));

    /* Tree functions */
    interp.setProperty(scope, 'randomTree', interp.createNativeFunction((name, depth, maxChildCount) => {
      algovis.addObject(Tree.createRandomTree({name: name.data, depth, maxChildCount}));
      return name;
    }));

    interp.setProperty(scope, 'randomBinaryTree', interp.createNativeFunction((name, depth) => {
      algovis.addObject(Tree.createRandomTree({name: name.data, depth: depth, maxChildCount: 2}));
      return name;
    }));

    interp.setProperty(scope, 'treeCreate', interp.createNativeFunction((name) => {
      algovis.addObject(new Tree({name: name.data}));
      return name;
    }));

    interp.setProperty(scope, 'binaryTreeCreate', interp.createNativeFunction((name) => {
      algovis.addObject(new Tree({name: name.data, binary: true}));
      return name;
    }));

    interp.setProperty(scope, 'treeRoot', interp.createNativeFunction((name) => {
      const tree = algovis.getObject(name.data);
      const node = tree.root;

      node.touch();

      return interp.createPrimitive(node.ref);
    }));

    interp.setProperty(scope, 'nodeLeft', interp.createNativeFunction((nodeRef) => {
      if(nodeRef.data === -1) return interp.createPrimitive(-1);

      const objName = getTreeFromNodeRef(nodeRef.data);
      const tree = algovis.getObject(objName);
      const node = tree.getNodeByRef(nodeRef.data);
      const left = node.getLeft();

      if(left) {
        //node.left.touch();
        return interp.createPrimitive(left.ref);
      }

      return interp.createPrimitive(-1);
    }));

    interp.setProperty(scope, 'nodeRight', interp.createNativeFunction((nodeRef) => {
      if(nodeRef.data === -1) return interp.createPrimitive(-1);

      const objName = getTreeFromNodeRef(nodeRef.data);
      const tree = algovis.getObject(objName);
      const node = tree.getNodeByRef(nodeRef.data);
      const right = node.getRight();

      if(right) {
        //node.right.touch();
        return interp.createPrimitive(right.ref);
      }

      return interp.createPrimitive(-1);
    }));

    interp.setProperty(scope, 'nodeValue', interp.createNativeFunction((nodeRef) => {
      const objName = getTreeFromNodeRef(nodeRef.data);
      const tree = algovis.getObject(objName);
      const node = tree.getNodeByRef(nodeRef.data);

      node.touch();

      return interp.createPrimitive(node.value);
    }));

    interp.setProperty(scope, 'nodeSetLeft', interp.createNativeFunction((nodeRef, value) => {
      const objName = getTreeFromNodeRef(nodeRef.data);
      const tree = algovis.getObject(objName);
      const node = tree.getNodeByRef(nodeRef.data);

      node.setLeft(tree.createNode({ value: value }));
      return interp.createPrimitive(node.getLeft().ref);
    }));

    interp.setProperty(scope, 'nodeSetLeftFromRef', interp.createNativeFunction((nodeRef, otherRef) => {
      console.log(otherRef.data);
      const objName = getTreeFromNodeRef(nodeRef.data);
      const tree = algovis.getObject(objName);
      const node = tree.getNodeByRef(nodeRef.data);

      if(otherRef.data == -1) {
        node.setLeft(null);
      } else {
        const other = tree.getNodeByRef(otherRef.data);
        node.setLeft(other);
      }

      return interp.createPrimitive(node.ref);
    }));

    interp.setProperty(scope, 'nodeSetRightFromRef', interp.createNativeFunction((nodeRef, otherRef) => {
      console.log(otherRef.data);
      const objName = getTreeFromNodeRef(nodeRef.data);
      const tree = algovis.getObject(objName);
      const node = tree.getNodeByRef(nodeRef.data);
      const other = tree.getNodeByRef(otherRef.data);

      if(otherRef.data == -1) {
        node.setRight(null);
      } else {
        const other = tree.getNodeByRef(otherRef.data);
        node.setRight(other);
      }

      return interp.createPrimitive(node.ref);
    }));

    interp.setProperty(scope, 'nodeSetRight', interp.createNativeFunction((nodeRef, value) => {
      const objName = getTreeFromNodeRef(nodeRef.data);
      const tree = algovis.getObject(objName);
      const node = tree.getNodeByRef(nodeRef.data);

      node.setRight(tree.createNode({ value: value }));
      return interp.createPrimitive(node.getRight().ref);
    }));

    interp.setProperty(scope, 'nodeRemoveLeft', interp.createNativeFunction((nodeRef) => {
      const objName = getTreeFromNodeRef(nodeRef.data);
      const tree = algovis.getObject(objName);
      const node = tree.getNodeByRef(nodeRef.data);

      node.setLeft(null);
      return interp.createPrimitive(nodeRef.data);
    }));

    interp.setProperty(scope, 'nodeRemoveRight', interp.createNativeFunction((nodeRef) => {
      const objName = getTreeFromNodeRef(nodeRef.data);
      const tree = algovis.getObject(objName);
      const node = tree.getNodeByRef(nodeRef.data);

      node.setRight(null);
      return interp.createPrimitive(nodeRef.data);
    }));

    interp.setProperty(scope, 'nodeChildCount', interp.createNativeFunction((nodeRef) => {
      const objName = getTreeFromNodeRef(nodeRef.data);
      const tree = algovis.getObject(objName);
      const node = tree.getNodeByRef(nodeRef.data);

      return interp.createPrimitive(node.children.length);
    }));

    interp.setProperty(scope, 'nodeGetChild', interp.createNativeFunction((nodeRef, i) => {
      const objName = getTreeFromNodeRef(nodeRef.data);
      const tree = algovis.getObject(objName);
      const node = tree.getNodeByRef(nodeRef.data);

      return interp.createPrimitive(node.children[i].ref);
    }));

    interp.setProperty(scope, 'nodeChildren', interp.createNativeFunction((nodeRef) => {
      const objName = getTreeFromNodeRef(nodeRef.data);
      const tree = algovis.getObject(objName);
      const node = tree.getNodeByRef(nodeRef.data);

      //return interp.createPrimitive(node.children.map((x) => {return x.ref; }));
      return interp.createPrimitive(JSON.stringify(node.children.map((x) => {return (x.ref); })));
    }));

    interp.setProperty(scope, 'nodeAddChild', interp.createNativeFunction((nodeRef, value) => {
      const objName = getTreeFromNodeRef(nodeRef.data);
      const tree = algovis.getObject(objName);
      const node = tree.getNodeByRef(nodeRef.data);

      const child = tree.createNode({ value: value.data });

      node.addChild(child)

      return interp.createPrimitive(child.ref);
    }));

    interp.setProperty(scope, 'nodeSet', interp.createNativeFunction((nodeRef, value) => {
      const objName = getTreeFromNodeRef(nodeRef.data);
      const tree = algovis.getObject(objName);
      const node = tree.getNodeByRef(nodeRef.data);

      node.value = value;

      return interp.createPrimitive(node.ref);
    }));

    /* Queue */
    interp.setProperty(scope, 'queueCreate', interp.createNativeFunction((name) => {
      const queue = new Queue({ name: name.data });
      algovis.addObject(queue);
      return name;
    }));

    interp.setProperty(scope, 'enqueue', interp.createNativeFunction((name, obj) => {
      const queue = algovis.getObject(name.data);
      queue.enqueue(obj);
    }));

    interp.setProperty(scope, 'dequeue', interp.createNativeFunction((name) => {
      const queue = algovis.getObject(name.data);
      var obj = queue.dequeue();

      return interp.createPrimitive(obj);
    }));

    interp.setProperty(scope, 'queueSize', interp.createNativeFunction((name) => {
      const queue = algovis.getObject(name.data);
      return interp.createPrimitive(queue.q.length);
    }));

    /* Graph */
    interp.setProperty(scope, 'graphCreate', interp.createNativeFunction((name) => {
      const graph = new Graph({ name: name.data });
      algovis.addObject(graph);

      return name;
    }));

    interp.setProperty(scope, 'addVertex', interp.createNativeFunction((graphName, name, x, y) => {
      const graph = algovis.getObject(graphName.data);

      var props = { name: name.data }

      if(x && y) {
        props = { ...props, pos: new Position(x, y) };
      }

      const vertex = graph.createVertex(props);

      return interp.createPrimitive(vertex.getRef());
    }));

    interp.setProperty(scope, 'addEdge', interp.createNativeFunction((graphName, v0Ref, v1Ref, weight) => {
      const graph = algovis.getObject(graphName.data);

      const v0 = graph.getVertexByRef(v0Ref.data);
      const v1 = graph.getVertexByRef(v1Ref.data);

      if(name === undefined) {
        name = {
          data: ""
        };
      }

      weight = Math.floor(Math.random()*100);

      const edge = graph.createEdge({ v0, v1, name: name.data, weight });
      //graph.createEdge({ v1, v0, name: name.data, weight });

      return interp.createPrimitive(edge.getRef());
    }));

    interp.setProperty(scope, 'vertexGetId', interp.createNativeFunction((vertexRef) => {
      const graph = algovis.getObject(getGraphFromRef(vertexRef.data));

      const vertex = graph.getVertexByRef(vertexRef.data);

      return interp.createPrimitive(vertex.id);
    }));

    interp.setProperty(scope, 'edgeGetWeight', interp.createNativeFunction((edgeRef) => {
      const graph = algovis.getObject(getGraphFromRef(edgeRef.data));

      const edge = graph.getEdgeByRef(edgeRef.data);
      edge.touch();

      return interp.createPrimitive(edge.weight);
    }));

    interp.setProperty(scope, 'edgeGetSource', interp.createNativeFunction((edgeRef) => {
      const graph = algovis.getObject(getGraphFromRef(edgeRef.data));

      const edge = graph.getEdgeByRef(edgeRef.data);

      return interp.createPrimitive(edge.v0.getRef());
    }));

    interp.setProperty(scope, 'edgeGetDest', interp.createNativeFunction((edgeRef) => {
      const graph = algovis.getObject(getGraphFromRef(edgeRef.data));

      const edge = graph.getEdgeByRef(edgeRef.data);

      return interp.createPrimitive(edge.v1.getRef());
    }));

    interp.setProperty(scope, 'edgeMark', interp.createNativeFunction((edgeRef) => {
      const graph = algovis.getObject(getGraphFromRef(edgeRef.data));

      const edge = graph.getEdgeByRef(edgeRef.data);
      edge.mark();
    }));

    interp.setProperty(scope, 'graphEdgeCount', interp.createNativeFunction((graphName) => {
      const graph = algovis.getObject(graphName.data);

      return interp.createPrimitive(graph.edges.length);
    }));

    interp.setProperty(scope, 'graphVertexCount', interp.createNativeFunction((graphName) => {
      const graph = algovis.getObject(graphName.data);

      return interp.createPrimitive(graph.vertices.length);
    }));

    interp.setProperty(scope, 'graphGetEdge', interp.createNativeFunction((graphName, index) => {
      const graph = algovis.getObject(graphName.data);
      const edge = graph.edges[index];

      edge.touch();

      return interp.createPrimitive(edge.getRef());
    }));
  })
}

const createSelection = (start, end) => {
  var field = document.getElementById('codearea');


  for (; start >= 1; start--) {
    if (field.value[start] == '\r' || field.value[start] == '\n') {
      start++;
      break;
    }
  }


  for (end = start; end < field.value.length; end++) {
    if (field.value[end] == '\r' || field.value[end] == '\n') {
      break;
    }
  }


  if (field.createTextRange) {
    var selRange = field.createTextRange();
    selRange.collapse(true);
    selRange.moveStart('character', start);
    selRange.moveEnd('character', end);
    selRange.select();
  } else if (field.setSelectionRange) {
    field.setSelectionRange(start, end);
  } else if (field.selectionStart) {
    field.selectionStart = start;
    field.selectionEnd = end;
  }
  field.focus();
}

class AlgoVis {
  constructor(props) {
    this.reset();
    this.offset = new Position();
    this.hint = "";
  }

  createInterpreter() {
    this.interpreter = createInterpreter(this, document.getElementById("codearea").value);
  }

  reset() {
    this.objects = [];
    this.interpreter = null;
    this.running = false;
    document.getElementById("varTableBody").innerHTML = "";
  }

  setupInterpreter() {
    this.reset();
    this.createInterpreter();
  }

  run() {
    this.setupInterpreter();
    this.running = true;
  }

  togglePause() {
    this.running = !this.running;
  }

  step() {
    if (this.interpreter !== null) {
      if (this.interpreter.stateStack.length) {
        var node =
          this.interpreter.stateStack[this.interpreter.stateStack.length - 1].node;
        var start = node.start;
        var end = node.end;
      } else {
        var start = 0;
        var end = 0;
      }
      createSelection(start, end);

      /* Find the last state stack the a scope.properties property */
      for(var i = this.interpreter.stateStack.length - 1; i >= 0; --i) {
        var stateStack = this.interpreter.stateStack[i];
        if (stateStack.scope && stateStack.scope.properties) {
          break;
        }
      }
      if (stateStack.scope && stateStack.scope.properties) {
        for (var key in stateStack.scope.properties) {
          var value = stateStack.scope.properties[key];

          if (key !== "Infinity" && key !== "NaN" && (value.type == "number" || value.type == "string")) {
            var elem = document.getElementById("var" + key);
            if (elem != null) {
              elem.innerHTML = "<td>" + key + "</td><td>" + value.data + "</td></tr>";
            } else {
              document.getElementById("varTableBody").innerHTML += "<tr id=var" + key + "><td>" + key + "</td><td>" + value.data + "</td></tr>";
            }
          }
        }
      }

      try {
        var step = this.interpreter.step();
      } catch(e) {
        alert(e);
        console.log(e);
        this.running = false;
      }

      if(!step) {
        this.running = false;
      }
    }
  }

  addObject(object) {
    this.objects.push(object);
  }

  getObject(name) {
    for(var i = 0; i < this.objects.length; ++i) {
      if(this.objects[i].name === name) {
        return this.objects[i];
      }
    }

    return null;
  }

  tick(dt) {
    this.objects.forEach((object) => {
      object.tick(dt);
    });
  }

  setHint(msg) {
    this.hint = msg;
  }

  render(renderer) {
    //let pos = this.offset.add(new Position(200, 200).mul(Constants.SCALE));
    let pos = this.offset.clone();

    this.objects.forEach((object) => {
      object.render(pos.clone(), renderer);

      pos.y += 400 * Constants.SCALE;
    });

    const hintSize = 40;

    const hintPos = new Position(renderer.canvas.width / 2, renderer.canvas.height - hintSize * 2);

    renderer.setDefaultFont(hintSize);

    renderer.renderText(this.hint, hintPos, { r: 255, g: 255, b: 255 }, "center");
  }
}

export default AlgoVis;
