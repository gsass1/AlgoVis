import Audio from './Audio';

const DIRTY_TIME = 1.0;

class Touchable {
  constructor(props) {
    this.dirty = false;
    this.dirtyTicks = 0;
  }

  tick(dt) {
    if (this.dirty) {
      this.dirtyTicks -= dt;
      if (this.dirtyTicks <= 0) {
        this.dirty = false;
      }
    }
  }

  touch() {
    if(this.value) {
      Audio.beep(this.value);
    }
    this.dirty = true;
    this.dirtyTicks = DIRTY_TIME;
  }

  getDirtyPercentage() {
    return 1.0 - this.dirtyTicks / DIRTY_TIME;
  }
}

export default Touchable;
