import Struct from './Struct.js'
import Util from './Util.js'
import Audio from './Audio';

const DIRTY_TIME = 1.0;
const SWAPPING_TIME = 0.1;

const DIRTYCOLOR = { r: 0, g: 255, b: 0 };

class ArrayData {
  constructor(props) {
    this.dirty = false;
    this.dirtyTicks = 0;
    this.swapping = false;
    this.value = 0;

    this.swappingTicks = 0;
    this.swappingTo = 0;
    this.finishedSwap = false;
  }

  tick(dt) {
    if (this.dirty) {
      this.dirtyTicks -= dt;
      if (this.dirtyTicks <= 0) {
        this.dirty = false;
      }
    }

    if (this.swapping) {
      this.swappingTicks -= dt;
      if (this.swappingTicks <= 0) {
        this.swapping = false;
        this.finishedSwap = true;
      }
    }
  }

  touch() {
    Audio.beep(this.value);
    this.dirty = true;
    this.dirtyTicks = DIRTY_TIME;
  }

  swapTo(i) {
    if(this.swapping) {
      throw new Error("already swapping");
    }

    this.swapping = true;

    this.touch();
    this.swappingTo = i;
    this.swappingTicks = SWAPPING_TIME;
  }

  stopSwapping() {
    this.swapping = false;
  }

  getSwapPercentage() {
    return 1.0 - this.swappingTicks / SWAPPING_TIME;
  }

  getDirtyPercentage() {
    return 1.0 - this.dirtyTicks / DIRTY_TIME;
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

    this.shuffle();
  }

  tick(dt) {
    for(var i = 0; i < this.size; ++i) {
      var data = this.arrayData[i];
      data.tick(dt);

      if(data.finishedSwap) {
        this.finishSwap(i);
      }
    }
  }

  add(value) {
    this.size++;
    this.array.push(value);
    this.arrayData.push(new ArrayData());
  }

  get(i) {
    if(this.arrayData[i].swapping) {
      this.finishSwap(i);
    }

    this.arrayData[i].touch();
    return this.array[i];
  }

  set(i, value) {
    this.array[i] = value;
    this.arrayData[i].value = value;

    this.arrayData[i].touch();
  }

  finishSwap(i) {
    var data = this.arrayData[i];
    data.finishedSwap = false;

    /* Actually do the swap inside the internal array */
    var tmp = this.array[i];
    this.array[i] = this.array[data.swappingTo];
    data.value = this.arrayData[data.swappingTo].value;
    this.array[data.swappingTo] = tmp;
    this.arrayData[data.swappingTo].value = tmp;

    /* Stop the other ArrayData element reversing the swap */
    this.arrayData[data.swappingTo].finishedSwap = false;

    this.arrayData[data.swappingTo].stopSwapping();
    data.stopSwapping();
  }

  swap(a, b) {
    a = a.data;
    b = b.data;

    if(a === b) {
      return;
    }

    if(this.arrayData[a].swapping) {
      this.finishSwap(a);
    }

    if(this.arrayData[b].swapping) {
      this.finishSwap(b);
    }

    this.arrayData[a].swapTo(b);
    this.arrayData[b].swapTo(a);
  }

  shuffle() {
    for(let i = 0; i < this.size; ++i) {
      this.array[i] = Math.ceil(Math.random()*100);
      this.arrayData[i].value = this.array[i];
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

    ctx.fillStyle = Util.colorToCSS(this.color);
    ctx.font = fontSize + "px Arial";
    ctx.fillText(this.getInfo(), pos.x, pos.y - boxMaxHeight);

    ctx.rect(pos.x, pos.y, 100, 100);
    ctx.stroke();

    for(var i = 0; i < this.size; ++i) {
      var x = pos.x + boxDist * i;
      var y = pos.y;

      if(this.arrayData[i].swapping) {
        var originX = pos.x + boxDist * i;
        var destX = pos.x + boxDist * (this.arrayData[i].swappingTo);
        var boxX = Util.lerpf(originX, destX, Util.smoothstep(this.arrayData[i].getSwapPercentage()));
        var boxY = pos.y;
      } else {
        var boxX = x;
        var boxY = y;
      }

      const height = Math.ceil(boxMaxHeight * (this.array[i] / 100.0));

      if(this.arrayData[i].dirty) {
        var interpColor = Util.lerpColor(DIRTYCOLOR, this.color, this.arrayData[i].getDirtyPercentage());
        ctx.fillStyle = Util.colorToCSS(interpColor);
      } else {
        ctx.fillStyle = Util.colorToCSS(this.color);
      }
      ctx.moveTo(x, y);
      ctx.fillRect(boxX, boxY - height, boxSize, height);

      ctx.fillText(i, x, y + fontSize);
    }
  }
}

export default List;
