import List from './List.js'
import Tree from './Tree.js'

import Interpreter from 'js-interpreter'

import './styles/main.scss'

let list = new List({size: 5, color: { r: 255, g: 255, b: 255 }});
list.shuffle();

let tree = new Tree({name: "Tree"});

let testCode = "var i = listGet('list', 0);"

let interpreter = new Interpreter(testCode, (interp, scope) => {
  /* List functions */
  interp.setProperty(scope, 'listGet', interp.createNativeFunction((name, i) => {
    return interp.createPrimitive(list.get(i));
  }));

  interp.setProperty(scope, 'listSet', interp.createNativeFunction((name, i, value) => {
    list.set(i, value);
  }));

  interp.setProperty(scope, 'listSwap', interp.createNativeFunction((name, a, b) => {
    list.swap(a, b);
  }));

  interp.setProperty(scope, 'listAdd', interp.createNativeFunction((name, value) => {
    list.add(value);
  }));

  /*
  var swapWrapper = function (i, j) {
    interpWait = true;
    return swap(i, j);
  };

  interp.setProperty(scope, 'swap',
    interp.createNativeFunction(swapWrapper));
    */
});

interpreter.run();

list.swap(0, 4);
list.add(100);
list.add(100);

function mainLoop() {
  let canvas = document.getElementById("canvas")
  let ctx = canvas.getContext("2d");

  ctx.canvas.height = 3*ctx.canvas.width/4;

  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  list.tick(1.0/60.0);

  list.render({x: 200, y: 150}, ctx);
  tree.render({x: 200, y: 400}, ctx);

  requestAnimationFrame(mainLoop);
}

mainLoop();
