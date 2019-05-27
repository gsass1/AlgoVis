import List from './List.js'
import Tree from './Tree.js'
import Interpreter from 'js-interpreter'
import './styles/main.scss'

let list = new List({size: 5, color: "#ff0000"});
list.shuffle();

let tree = new Tree({name: "Tree"});

function mainLoop() {
  let canvas = document.getElementById("canvas")
  let ctx = canvas.getContext("2d");

  ctx.canvas.height = 3*ctx.canvas.width/4;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  list.render({x: 200, y: 150}, ctx);
  tree.render({x: 200, y: 400}, ctx);

  requestAnimationFrame(mainLoop);
}

mainLoop();
