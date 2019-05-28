import AlgoVis from './AlgoVis'

import List from './List.js'
import Tree from './Tree.js'

import './styles/main.scss'

let list = new List({size: 5, color: { r: 255, g: 255, b: 255 }});
list.shuffle();

let tree = new Tree({name: "Tree"});

list.swap(0, 4);
list.add(100);
list.add(100);

let defaultCode = "listCreate('l', 10);\nlistSwap('l', 0, 1);"
document.getElementById("codearea").value = defaultCode;

let algovis = new AlgoVis();

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
