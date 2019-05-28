import AlgoVis from './AlgoVis'

import List from './List.js'
import Tree from './Tree.js'

import './styles/main.scss'

const INTERPRETER_SPEED = 50;

let list = new List({size: 5, color: { r: 255, g: 255, b: 255 }});
list.shuffle();

let tree = new Tree({name: "Tree"});

list.swap(0, 4);
list.add(100);
list.add(100);

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

let algovis = new AlgoVis();

document.getElementById("codeRun").onclick = e => {
  algovis.run();
};

document.getElementById("codePause").onclick = e => {
  algovis.pause();
};

document.getElementById("codeStep").onclick = e => {
  algovis.step();
};

let examples = [
  {
    name: "bubblesort",
    code: "var l = listCreate('l', 10);\n" +
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

  ctx.canvas.height = 3*ctx.canvas.width/4;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  /*
  list.tick(1.0/60.0);

  list.render({x: 200, y: 150}, ctx);
  tree.render({x: 200, y: 400}, ctx);
  */

  algovis.tick(1.0/60.0);
  algovis.render(ctx);

  requestAnimationFrame(mainLoop);
}

mainLoop();


function interpreterLoop() {
  if(algovis && algovis.running) {
    algovis.step();
  }

  setTimeout(interpreterLoop, INTERPRETER_SPEED);
}

interpreterLoop();