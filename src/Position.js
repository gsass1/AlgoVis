class Position {
  constructor(x, y) {
    this.x = x || 0;
    this.y = y || 0;
  }

  add(x, y) {
    if(y === undefined) {
      var pos = x;
      return new Position(this.x + pos.x, this.y + pos.y);
    } else {
      return new Position(this.x + x, this.y + y);
    }
  }

  sub(x, y) {
    if(y === undefined) {
      var pos = x;
      return new Position(this.x - pos.x, this.y - pos.y);
    } else {
      return new Position(this.x - x, this.y - y);
    }
  }

  mul(f) {
    return new Position(this.x * f, this.y * f);
  }

  clone() {
    return new Position(this.x, this.y);
  }
}

export default Position;
