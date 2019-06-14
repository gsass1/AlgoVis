import Constants from './Constants';
import Position from './Position';
import Struct from './Struct'
import Touchable from './Touchable';
import Util from './Util'

const SWAPPING_TIME = 0.1;

const DIRTYCOLOR = { r: 0, g: 255, b: 0 };

const MAX_VALUE = 100.0;

class ArrayData extends Touchable {
  constructor(props) {
    super(props);

    this.swapping = false;
    this.value = 0;

    this.swappingTicks = 0;
    this.swappingTo = 0;
    this.finishedSwap = false;
  }

  tick(dt) {
    super.tick(dt);

    if (this.swapping) {
      this.swappingTicks -= dt;
      if (this.swappingTicks <= 0) {
        this.swapping = false;
        this.finishedSwap = true;
      }
    }
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
}

class List extends Struct {
  constructor(props) {
    super(props);
    this.name = props.name || "List";
    this.size = props.size;
    this.array = new Array(props.size);
    this.arrayData = new Array(props.size);
    this.color = props.color || Util.randomColorUpper();

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
      this.array[i] = Math.ceil(Math.random() * MAX_VALUE);
      this.arrayData[i].value = this.array[i];
    }
  }

  getInfo() {
    return `${this.name} (${this.size})`;
  }

  render(pos, renderer) {
    const w = 40 * Constants.SCALE;
    const boxDist = 45 * Constants.SCALE;
    const boxMaxh = 100 * Constants.SCALE;
    const fontSize = 12 * Constants.SCALE;

    renderer.setDefaultFont(fontSize);
    renderer.renderText(this.getInfo(), { x: pos.x, y: pos.y - boxMaxh }, this.color);

    const getBoxX = (i) => {
      return pos.x + boxDist * i;
    };

    for(var i = 0; i < this.size; ++i) {
      var x = getBoxX(i); 
      var y = pos.y;

      if(this.arrayData[i].swapping) {
        var originX = x;
        var destX = getBoxX(this.arrayData[i].swappingTo);

        var boxX = Util.lerpf(originX, destX, Util.smoothstep(this.arrayData[i].getSwapPercentage()));
      } else {
        var boxX = x;
      }

      const h = Math.ceil(boxMaxh * (this.array[i] / MAX_VALUE));

      if(this.arrayData[i].dirty) {
        var color = Util.lerpColor(DIRTYCOLOR, this.color, this.arrayData[i].getDirtyPercentage());
      } else {
        var color = this.color;
      }

      renderer.renderFilledRect({ x: boxX, y: y - h }, { w, h }, color);
      renderer.renderText(i, { x: x + w / 2, y: y + fontSize * 1.5 }, color, "center");
    }
  }
}

export default List;
