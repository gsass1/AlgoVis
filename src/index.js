import AlgoVis from './AlgoVis'

import List from './List.js'
import Renderer from './Renderer.js'
import Tree from './Tree.js'

import Constants from './Constants.js';

import './styles/main.scss'

var INTERPRETER_DELAY = 5;
var ZOOM = 1;
var ASPECT_RATIO = 1;

const BG_COLOR = { r: 0, g: 0, b:0  };

const updateInterpreterDelay = () => {
  INTERPRETER_DELAY = 30 - document.getElementById("speedSlider").value;
}

updateInterpreterDelay();

document.getElementById("speedSlider").onchange = function(e) {
  updateInterpreterDelay();
};


let algovis = new AlgoVis();

/* CONTROL BUTTONS */

document.getElementById("codeRun").onclick = e => {
  algovis.run();
};

document.getElementById("codePause").onclick = e => {
  algovis.togglePause();
};

document.getElementById("codeStep").onclick = e => {
  algovis.step();
};

var canvas = document.getElementById("canvas");

var drag = false;
var dragStart;
var dragEnd;

canvas.addEventListener('mousedown', function(event) {
  dragStart = {
    x: event.pageX - canvas.offsetLeft,
    y: event.pageY - canvas.offsetTop
  }

  drag = true;
});

canvas.addEventListener('mouseup', function(event) {
  drag = false;
});

canvas.addEventListener('mousemove', function(event) {
  if (drag) {
    dragEnd = {
      x: event.pageX - canvas.offsetLeft,
      y: event.pageY - canvas.offsetTop
    }
    algovis.offset.x += (dragEnd.x - dragStart.x);
    algovis.offset.y += (dragEnd.y - dragStart.y);
    dragStart = dragEnd;
  }
});

canvas.addEventListener("wheel", function(e) {
  const {x, y, deltaY} = e;
  const direction = deltaY > 0 ? -1 : 1;
  const factor = 0.1;
  const zoom = 1 * direction * factor;

  const pos = {
    x: event.pageX - canvas.offsetLeft,
    y: event.pageY - canvas.offsetTop
  }


  algovis.offset.x -= (pos.x-algovis.offset.x)/(ZOOM)*zoom;
  algovis.offset.y -= (pos.y-algovis.offset.y)/(ZOOM)*zoom;

  ZOOM += zoom;

  if(ZOOM < 0.1) {
    ZOOM = 0.1;
  }

  Constants.SCALE = ASPECT_RATIO * ZOOM;
});

/* EXAMPLES */

let examples = [
  {
    name: "bubblesort",
    code: "var l = listCreate('List', 10);\n" +
    "\n" +
    "for (var i = 0; i < listSize(l) - 1; i++) {\n" +
    "  for (var j = 0; j < listSize(l) - i - 1; j++) {\n" +
    "    var p = listGet(l, j);\n" +
    "    var q = listGet(l, j + 1);\n" +
    "    if (p > q) {\n" +
    "      listSwap(l, j, j + 1);\n" +
    "    }\n" +
    "  }\n" +
    "}"
  },
  {
    name: "insertionsort",
    code: "var list = listCreate('List', 10);\n" +
    "\n" +
    "for (var i = 0; i < 10; i++) {\n" +
    "  var j = i;\n" +
    "  while (j > 0 && listGet(list, j) < listGet(list, j - 1)) {\n" +
    "    listSwap(list, j, j - 1);\n" +
    "    j--;\n" +
    "  }\n" +
    "}"
  },
  {
    name: "quicksort",
    code: "var list = listCreate('List', 10);\n" +
    "\n" +
    "function quicksort(begin, end) {\n" +
    "  if (end > begin) {\n" +
    "    var pivot = listGet(list, Math.floor((begin + end) / 2));\n" +
    "    var left = begin;\n" +
    "    var right = end;\n" +
    "\n" +
    "    listSwap(list, begin, Math.floor((begin + end) / 2));\n" +
    "    pivot = listGet(list, begin);\n" +
    "\n" +
    "    while (left < right) {\n" +
    "        if (listGet(list, left) <= pivot) {\n" +
    "            left++;\n" +
    "        } else {\n" +
    "            while (left < --right && listGet(list, right) >= pivot);\n" +
    "            listSwap(list, left, right);\n" +
    "        }\n" +
    "    }\n" +
    "\n" +
    "    left--;\n" +
    "    listSwap(list, begin, left);\n" +
    "    quicksort(begin, left);\n" +
    "    quicksort(right, end);\n" +
    "  }\n" +
    "}\n" +
    "\n" +
    "quicksort(0, listLength(list));\n"
  },
  {
    name: "breadthfirstsearch",
    code: "var tree = randomTree('tree');\n" +
    "var root = treeRoot(tree);\n" +
    "\n" +
    "var q = queueCreate('queue');\n" +
    "\n" +
    "hint(\"Start with enqueueing the root node\");\n" +
    "enqueue(q, root);\n" +
    "\n" +
    "while(queueSize(q) != 0) {\n" +
    "  hint(\"1. Dequeue the first node\");\n" +
    "\n" +
    "  var tempNode = dequeue(q); \n" +
    "\n" +
    "  for(var i = 0; i < nodeChildCount(tempNode); ++i) {\n" +
    "    hint(\"2. Visit all children and enqueue them: \" + (i+1) + \"/\" + nodeChildCount(tempNode));\n" +
    "\n" +
    "    var c = nodeGetChild(tempNode, i);\n" +
    "    nodeValue(c); // mark as visited\n" +
    "    enqueue(q, c); \n" +
    "  } \n" +
    "}\n"
  },
  {
    name: "depthfirstsearch",
    code: "var tree = randomTree('tree');\n" +
    "var root = treeRoot(tree);\n" +
    "\n" +
    "function depthSearch(node) {\n" +
    "  nodeValue(node);\n" +
    "\n" +
    "  for(var i = 0; i < nodeChildCount(node); ++i) {\n" +
    "    depthSearch(nodeGetChild(node, i));\n" +
    "  }\n" +
    "}\n" +
    "\n" +
    "depthSearch(root);\n"
  },
  {
    name: "bstinsertsearch",
    code: "var tree = treeCreate('tree');\n" +
    "var root = treeRoot(tree);\n" +
    "\n" +
    "nodeSet(root, 50);\n" +
    "\n" +
    "function BST_Insert(node, value) {\n" +
    "  var nvalue = nodeValue(node);\n" +
    "  if(value < nvalue) {\n" +
    "    if(nodeLeft(node) != -1) {\n" +
    "      BST_Insert(nodeLeft(node), value);\n" +
    "    } else {\n" +
    "      nodeSetLeft(node, value);\n" +
    "    }\n" +
    "  } else if(value > nvalue) {\n" +
    "    if(nodeRight(node) != -1) {\n" +
    "      BST_Insert(nodeRight(node), value);\n" +
    "    } else {\n" +
    "      nodeSetRight(node, value);\n" +
    "    }\n" +
    "  }\n" +
    "}\n" +
    "\n" +
    "for(var i = 0; i < 10; ++i) {\n" +
    "    BST_Insert(root, Math.floor(Math.random() * 100)); \n" +
    "}\n" +
    "\n" +
    "BST_Insert(root, 40); \n" +
    "\n" +
    "function BST_Search(node, value) {\n" +
    "  if(node == -1) return -1;\n" +
    "   \n" +
    "  var nvalue = nodeValue(node);\n" +
    "  if(nvalue == value) return node;\n" +
    "\n" +
    "  if(nvalue < value) {\n" +
    "    return BST_Search(nodeLeft(node), value);\n" +
    "  } else {\n" +
    "    return BST_Search(nodeRight(node), value);\n" +
    "  }\n" +
    "\n" +
    "return -1;\n" +
    "}\n" +
    "\n" +
    "BST_Search(root, 40);\n"
  },
  {
    name: "bstdelete",
    code: "var tree = treeCreate('tree');\n" +
    "var root = treeRoot(tree);\n" +
    "\n" +
    "nodeSet(root, 50);\n" +
    "\n" +
    "function BST_Insert(node, value) {\n" +
    "  var nvalue = nodeValue(node);\n" +
    "  if(value < nvalue) {\n" +
    "    if(nodeLeft(node) != -1) {\n" +
    "      BST_Insert(nodeLeft(node), value);\n" +
        "} else {\n" +
    "      nodeSetLeft(node, value);\n" +
    "    }\n" +
    "  } else if(value > nvalue) {\n" +
    "    if(nodeRight(node) != -1) {\n" +
    "      BST_Insert(nodeRight(node), value);\n" +
    "    } else {\n" +
    "      nodeSetRight(node, value);\n" +
    "    }\n" +
    "  }\n" +
    "}\n" +
    "\n" +
    "BST_Insert(root, 40); \n" +
    "BST_Insert(root, 20); \n" +
    "BST_Insert(root, 30); \n" +
    "BST_Insert(root, 13); \n" +
    "function BST_DeleteNode(node, value) {\n" +
    "  // base case \n" +
    "  if (node == -1) return node; \n" +
    "\n" +
    "\n" +
    "  var nvalue = nodeValue(node);\n" +
    "\n" +
    "  // If the key to be deleted is smaller than the root's key, \n" +
    "  // then it lies in left subtree \n" +
    "  if (value < nvalue) {\n" +
    "    var left = nodeLeft(node);\n" +
    "    nodeSetLeftFromRef(node, BST_DeleteNode(left, value));\n" +
    "\n" +
    "    // If the key to be deleted is greater than the root's key, \n" +
    "    // then it lies in right subtree \n" +
    "  } else if (value > nvalue)  {\n" +
    "    var right = nodeRight(node);\n" +
    "    nodeSetRightFromRef(node, BST_DeleteNode(right, value));\n" +
    "  }\n" +
    "\n" +
    "  // if key is same as root's key, then This is the node \n" +
    "  // to be deleted \n" +
    "  else\n" +
    "  { \n" +
    "    // node with only one child or no child \n" +
    "    if (nodeLeft(node) == -1) \n" +
    "    { \n" +
    "      return nodeRight(node); \n" +
    "    } \n" +
    "    else if (nodeRight(node) == -1) \n" +
    "    { \n" +
    "      return nodeLeft(node); \n" +
    "    } \n" +
    "\n" +
    "    // node with two children: Get the inorder successor (smallest \n" +
    "    // in the right subtree) \n" +
    "    var temp = BST_MinValue(nodeRight(node)); \n" +
    "    log(node);\n" +
    "    nodeSet(node, nodeValue(temp));\n" +
    "    nodeSetRightFromRef(node, BST_DeleteNode(nodeRight(node), nodeValue(temp)));\n" +
    "  }\n" +
    "\n" +
      "return node;\n" +
    "}\n" +
    "\n" +
    "BST_DeleteNode(root, 40);\n"
  },
  {
    name: "kruskal",
    code: "var g = graphCreate('graph');\n" +
"\n" +
"var v0 = addVertex(g, 'v0', 100, -100);\n" +
"var v1 = addVertex(g, 'v1', 0, 0);\n" +
"var v2 = addVertex(g, 'v2', 100, 100);\n" +
"var v3 = addVertex(g, 'v3', 200, -100);\n" +
"var v4 = addVertex(g, 'v4', 200, 100);\n" +
"var v5 = addVertex(g, 'v5', 200, 0);\n" +
"var v6 = addVertex(g, 'v6', 300, -100);\n" +
"var v7 = addVertex(g, 'v7', 300, 100);\n" +
"var v8 = addVertex(g, 'v8', 400, 0);\n" +
"\n" +
"addEdge(g, v0, v1, 4);\n" +
"addEdge(g, v1, v2, 8);\n" +
"addEdge(g, v0, v2, 11);\n" +
"addEdge(g, v2, v5, 7);\n" +
"addEdge(g, v0, v3, 8);\n" +
"addEdge(g, v2, v4, 1);\n" +
"addEdge(g, v3, v5, 2);\n" +
"addEdge(g, v5, v4, 6);\n" +
"addEdge(g, v3, v7, 4);\n" +
"addEdge(g, v3, v6, 7);\n" +
"addEdge(g, v4, v7, 2);\n" +
"addEdge(g, v6, v7, 14);\n" +
"addEdge(g, v6, v8, 9);\n" +
"addEdge(g, v7, v8, 10);\n" +
"\n" +
"function find(subsets, i) \n" +
"{ \n" +
"  if (subsets[i].parent != i) \n" +
"    subsets[i].parent = find(subsets, subsets[i].parent); \n" +
"\n" +
"  return subsets[i].parent; \n" +
"} \n" +
"\n" +
"function Union(subsets, x,y ) {\n" +
"  xroot = find(subsets, x); \n" +
"  yroot = find(subsets, y); \n" +
"\n" +
"  // Attach smaller rank tree under root of high  \n" +
"  // rank tree (Union by Rank) \n" +
"  if (subsets[xroot].rank < subsets[yroot].rank) \n" +
"    subsets[xroot].parent = yroot; \n" +
"  else if (subsets[xroot].rank > subsets[yroot].rank) \n" +
"    subsets[yroot].parent = xroot; \n" +
"\n" +
"  else\n" +
"  { \n" +
"    subsets[yroot].parent = xroot; \n" +
"    subsets[xroot].rank++; \n" +
"  } \n" +
"}\n" +
"\n" +
"function KruskalMST(g) { \n" +
"  var n = graphEdgeCount(g);\n" +
"  var result = [];\n" +
"  var vertexCount = graphVertexCount(g);\n" +
"\n" +
"  var ei = 0;\n" +
"  var i = 0;\n" +
"\n" +
"  var edgeCopy = []\n" +
"  for(var j = 0; j < n; ++j) {\n" +
"    var e = graphGetEdge(g, j);\n" +
"    var w = edgeGetWeight(e);\n" +
"\n" +
"    edgeCopy.push({ e: e, w: w });\n" +
"  }\n" +
"\n" +
"  edgeCopy.sort(function(a, b) {\n" +
"    return a.w > b.w;\n" +
"  });\n" +
"\n" +
"  var subsets = [];\n" +
"  for(var v = 0; v < vertexCount; ++v) {\n" +
"    subsets.push({\n" +
"      parent: v,\n" +
"      rank: 0,\n" +
"    });\n" +
"  }\n" +
"\n" +
"  while(ei < vertexCount - 1) {\n" +
"    nextEdge = edgeCopy[i++];\n" +
"\n" +
"    var source = edgeGetSource(nextEdge.e);\n" +
"    var dest = edgeGetDest(nextEdge.e);\n" +
"\n" +
"    edgeGetWeight(nextEdge.e);\n" +
"\n" +
"    var x = find(subsets, vertexGetId(source)); \n" +
"    var y = find(subsets, vertexGetId(dest)); \n" +
"\n" +
"    if(x !== y) {\n" +
"      ++ei;\n" +
      "result.push(nextEdge);\n" +
"      edgeMark(nextEdge.e);\n" +
"\n" +
"      Union(subsets, x, y); \n" +
"    }\n" +
"  }\n" +
"\n" +
"  return result;\n" +
"} \n" +
"\n" +
"KruskalMST(g);\n"
  }
];

const loadExample = (name) => {
  examples.forEach((example) => {
    if(example.name === name) {
      document.getElementById("codearea").value = example.code;
    }
  });
}

document.querySelectorAll("a.example-btn").forEach(exampleBtn => {
  exampleBtn.onclick = (e) => {
    loadExample(exampleBtn.getAttribute("data-example"));
  }
});

if(document.getElementById("codearea").value === "") {
  loadExample("kruskal");
}

algovis.setupInterpreter();

let renderer = new Renderer({ canvas });

let ctx = canvas.getContext("2d");

ctx.canvas.width = window.innerWidth*0.75;
ctx.canvas.height = 1 * ctx.canvas.width;

algovis.offset.x = ctx.canvas.width/2;
algovis.offset.y = ctx.canvas.height/2;

algovis.offset = algovis.offset.sub(200, 200);

function mainLoop() {
  ctx.canvas.width = window.innerWidth*0.75;
  ctx.canvas.height = 1 * ctx.canvas.width;

  //ctx.canvas.width = 1 * ctx.canvas.height;

  ASPECT_RATIO = ctx.canvas.width/1280.0;
  //ASPECT_RATIO = 1;

  Constants.SCALE = ASPECT_RATIO * ZOOM;

  renderer.fillScreen(BG_COLOR);

  algovis.tick(1.0/60.0);
  algovis.render(renderer);

  requestAnimationFrame(mainLoop);
}

mainLoop();


function interpreterLoop() {
  if(algovis && algovis.running) {
    algovis.step();
  }

  setTimeout(interpreterLoop, INTERPRETER_DELAY);
}

interpreterLoop();
