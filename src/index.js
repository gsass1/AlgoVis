import AlgoVis from './AlgoVis'
import Constants from './Constants.js';
import Examples from './Examples.js'
import Renderer from './Renderer.js'

import './styles/main.scss'

var INTERPRETER_DELAY = 5;
var ZOOM = 1;
var ASPECT_RATIO = 1;
const BG_COLOR = { r: 0, g: 0, b:0  };

const algovis = new AlgoVis();
const canvas = document.getElementById("canvas");

const loadExample = (name) => {
  Examples.forEach((example) => {
    if(example.name === name) {
      document.getElementById("codearea").value = example.code;
    }
  });
}

const setupDOMEvents = () => {
  const updateInterpreterDelay = () => {
    INTERPRETER_DELAY = 30 - document.getElementById("speedSlider").value;
  }

  updateInterpreterDelay();

  document.getElementById("speedSlider").onchange = function(e) {
    updateInterpreterDelay();
  };


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


  document.querySelectorAll("a.example-btn").forEach(exampleBtn => {
    exampleBtn.onclick = (e) => {
      loadExample(exampleBtn.getAttribute("data-example"));
    }
  });
};

const parseParams = () => {
  /**
   * Get the URL parameters
   * source: https://css-tricks.com/snippets/javascript/get-url-variables/
   * @param  {String} url The URL
   * @return {Object}     The URL parameters
   */
  var getParams = function (url) {
    var params = {};
    var parser = document.createElement('a');
    parser.href = url;
    var query = parser.search.substring(1);
    var vars = query.split('&');
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      params[pair[0]] = decodeURIComponent(pair[1]);
    }
    return params;
  };

  var params = getParams(window.location.href);

  if(params["example"]) {
    loadExample(params["example"]);
  } else {
    if(document.getElementById("codearea").value === "") {
      loadExample("kruskal");
    }
  }
}

const main = () => {
  setupDOMEvents();
  parseParams();

  algovis.setupInterpreter();

  let renderer = new Renderer({ canvas });
  let ctx = canvas.getContext("2d");

  const keepCanvasAspectRatio = () => {
    ctx.canvas.width = window.innerWidth*0.75;
    ctx.canvas.height = 1 * ctx.canvas.width;
  };

  keepCanvasAspectRatio();

  /* Center the view */
  algovis.offset.x = ctx.canvas.width/2;
  algovis.offset.y = ctx.canvas.height/2;
  algovis.offset = algovis.offset.sub(200, 200);

  const mainLoop = () => {
    keepCanvasAspectRatio();

    /* FIXME: this sucks */
    ASPECT_RATIO = ctx.canvas.width/1280.0;
    Constants.SCALE = ASPECT_RATIO * ZOOM;

    renderer.fillScreen(BG_COLOR);

    /* TODO: this assumes 60 FPS */
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
}

main();
