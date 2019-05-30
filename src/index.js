import AlgoVis from './AlgoVis'

import List from './List.js'
import Tree from './Tree.js'

import './styles/main.scss'

const INTERPRETER_DELAY = 1;

const BG_COLOR = "#000000";

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

/* CONTROL BUTTONS */

document.getElementById("codeRun").onclick = e => {
  algovis.run();
};

document.getElementById("codePause").onclick = e => {
  algovis.pause();
};

document.getElementById("codeStep").onclick = e => {
  algovis.step();
};

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

  /* This is to keep the aspect ratio from fucking up */
  ctx.canvas.height = 3*ctx.canvas.width/4;

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
