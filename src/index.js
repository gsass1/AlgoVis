import AlgoVis from './AlgoVis'

import List from './List.js'
import Tree from './Tree.js'

import Constants from './Constants.js';

import './styles/main.scss'

var INTERPRETER_DELAY = 5;
var ZOOM = 1;
var ASPECT_RATIO = 1;

const BG_COLOR = "#00000";

let defaultCode = "var l = listCreate('l', 10);\n" +
"\n" +
"//Bubble sort\n" +
"for (var i = 0; i < listSize(l) - 1; i++) {\n" +
"  for (var j = 0; j < listSize(l) - i - 1; j++) {\n" +
"    var p = listGet(l, j);\n" +
"    var q = listGet(l, j + 1);\n" +
"    if (p > q) {\n" +
"      listSwap(l, j, j + 1);\n" +
"    }\n" +
"  }\n" +
"}";

if(document.getElementById("codearea").value === "") {
  document.getElementById("codearea").value = defaultCode;
}

const updateInterpreterDelay = () => {
  INTERPRETER_DELAY = 10 - document.getElementById("speedSlider").value;
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
    "enqueue(q, root);\n" +
    "\n" +
    "while(queueSize(q) != 0) {\n" +
    "  var tempNode = dequeue(q); \n" +
    "  for(var i = 0; i < nodeChildCount(tempNode); ++i) {\n" +
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

algovis.setupInterpreter();

function mainLoop() {
  let canvas = document.getElementById("canvas")
  let ctx = canvas.getContext("2d");

  ctx.canvas.width = window.innerWidth*0.75;

  /* This is to keep the aspect ratio from fucking up */
  //ctx.canvas.height = 1.5 * ctx.canvas.width;
  ctx.canvas.height = 1 * ctx.canvas.width;

  //ASPECT_RATIO = ctx.canvas.width/1280.0;
  ASPECT_RATIO = 1;

  Constants.SCALE = ASPECT_RATIO * ZOOM;

  ctx.fillStyle = BG_COLOR;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  algovis.tick(1.0/60.0);
  algovis.render(ctx);

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
