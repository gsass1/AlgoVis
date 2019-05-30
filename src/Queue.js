import Struct from './Struct.js'
import Util from './Util.js'

import Constants from './Constants';

class Queue extends Struct {
  constructor(props) {
    super(props);

    this.color = props.color || Util.randomColor();
    this.name = props.name;
    this.q = [];
  }

  enqueue(obj) {
    this.q.push(obj);
  }

  dequeue() {
    return this.q.shift();
  }

  getInfo() {
    return this.name + " (" + this.q.length + ")";
  }

  tick(dt) {
  }

  render(pos, ctx) {
    ctx.textAlign = "left";

    const height = 40 * Constants.SCALE;
    const dist = 10 * Constants.SCALE;
    const fontSize = 12 * Constants.SCALE;

    ctx.font = fontSize + "px Arial";
    ctx.fillStyle = Util.colorToCSS(this.color);
    ctx.fillText(this.getInfo(), pos.x, pos.y - 50);


    var x = pos.x;
    for(var i = 0; i < this.q.length; ++i) {
      var s = "" + this.q[i];

      const width = s.length * fontSize;
      ctx.fillStyle = Util.colorToCSS(this.color);
      ctx.fillRect(x, pos.y, width, height);

      ctx.fillStyle = "#000000";
      ctx.fillText(s, x+20, pos.y+height/2);

      x += width + dist;
    }
  }
}

export default Queue;
