import Struct from './Struct.js'

class ArrayData {
  constructor(props) {
    this.dirty = false;
  }
}

class List extends Struct {
  constructor(props) {
    super(props);
    this.name = props.name || "List";
    this.size = props.size;
    this.array = new Array(props.size);
    this.arrayData = new Array(props.size);
    this.color = props.color || "#ffffff";

    for(let i = 0; i < props.size; ++i) {
      this.arrayData[i] = new ArrayData();
      this.array[i] = 0;
    }
  }

  shuffle() {
    for(let i = 0; i < this.size; ++i) {
      this.array[i] = Math.floor(Math.random()*100);
    }
  }

  getInfo() {
    return this.name + " (" + this.size + ")";
  }

  render(pos, ctx) {
    const boxSize = 40;
    const boxDist = 45;
    const boxMaxHeight = 100;
    const fontSize = 12;

    ctx.fillStyle = this.color;
    ctx.font = fontSize + "px Arial";
    ctx.fillText(this.getInfo(), pos.x, pos.y - boxMaxHeight);

    ctx.rect(pos.x, pos.y, 100, 100);
    ctx.stroke();

    for(var i = 0; i < this.size; ++i) {
      const x = pos.x + boxDist * i;
      const y = pos.y;
      const height = Math.ceil(boxMaxHeight * (this.array[i] / 100.0));

      ctx.fillStyle = this.color;
      ctx.moveTo(x, y);
      ctx.fillRect(x, y - height, boxSize, height);

      ctx.fillText(i, x, y + fontSize);
    }
  }
}

export default List;
