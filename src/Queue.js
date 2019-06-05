import Constants from './Constants';
import Struct from './Struct.js'
import Util from './Util.js'

class Queue extends Struct {
  constructor(props) {
    super(props);

    this.color = props.color || Util.randomColorUpper();
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
    return `${this.name} (${this.q.length})`;
  }

  tick(dt) {
  }

  render(pos, r) {
    const h = 40 * Constants.SCALE;
    const dist = 10 * Constants.SCALE;
    const fontSize = 12 * Constants.SCALE;

    r.setDefaultFont(fontSize);
    r.renderText(this.getInfo(), pos.sub(0, 50), this.color);

    for(var i = 0; i < this.q.length; ++i) {
      var s = "" + this.q[i];

      const w = (s.length + 2) * fontSize;
      r.renderFilledRect(pos, { w, h }, this.color);

      r.renderText(s, pos.add(w / 2, h / 2), { r: 0, g: 0, b: 0 }, "center");

      pos.x += w + dist;
    }
  }
}

export default Queue;
