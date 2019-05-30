import Struct from './Struct.js'
import Util from './Util.js'
import Audio from './Audio';

import Constants from './Constants';

const DIRTY_TIME = 1.0;
const DIRTYCOLOR = { r: 0, g: 255, b: 0 };

class Node {
  constructor(props) {
    this.ref = props.ref;
    //this.value = Math.ceil(Math.random()*100);
    this.value = props.value;
    this.children = new Array(0);
    this.left = props.left || null;
    this.right = props.right || null;

    if(this.left) this.children.push(this.left);
    if(this.right) this.children.push(this.right);

    this.tree = props.tree;
    this.dirty = false;
    this.dirtyTicks = 0;
  }

  addChild(node) {
    this.children.push(node);
  }

  tick(dt) {
    if(this.dirty) {
      this.dirtyTicks -= dt;
      if(this.dirtyTicks <= 0) {
        this.dirty = false;
      }
    }
  }

  getDirtyPercentage() {
    return 1.0 - this.dirtyTicks / DIRTY_TIME;
  }

  touch() {
    Audio.beep(this.value);
    this.dirty = true;
    this.dirtyTicks = DIRTY_TIME;
  }

  getLeft() {
    if(this.children.length >= 1) return this.children[0];
    return null;
  }

  getRight() {
    if(this.children.length >= 2) return this.children[1];
    return null;
  }

  setLeft(node) {
    this.children[0] = node;
  }

  setRight(node) {
    console.log("setRight");
    console.log(this.children);
    this.children[1] = node;
    console.log(this.children);
  }

  render(pos, ctx, depth) {
    const size = 20*Constants.SCALE;
    const fontSize = 12*Constants.SCALE;

    if(this.dirty) {
      var color = Util.lerpColor(DIRTYCOLOR, this.tree.color, this.getDirtyPercentage());
    } else {
      var color = this.tree.color;
    }

    var n = this.children.length;
    var dist = n*25*Constants.SCALE*depth;
    var x = -dist;
    var xd = dist*4.0/n;

    for(var i = 0; i < this.children.length; ++i) {
      var child = this.children[i];

      if(child === null || child === undefined) {
        x += xd;
        continue;
      }

      const childPos = {
        x: pos.x + x,
        y: pos.y + 80*Constants.SCALE
      };

      ctx.beginPath();
      ctx.moveTo(pos.x+size/2, pos.y+size/2);
      ctx.lineTo(childPos.x+size/2, childPos.y+size/2);
      ctx.closePath();

      ctx.strokeStyle = Util.colorToCSS(color);
      ctx.lineWidth = 3;
      ctx.stroke();

      child.render(childPos, ctx, depth + 1);

      x += xd;
    }


    ctx.beginPath();
    ctx.arc(pos.x+size/2, pos.y+size/2, size, 0, 2 * Math.PI);
    ctx.fillStyle = Util.colorToCSS(color);
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#fff";
    ctx.stroke();

    ctx.font = fontSize + "px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(this.value, pos.x + size/2, pos.y + size/1.5);

  }
}

class Tree extends Struct {
  constructor(props) {
    super(props);

    this.color = props.color || Util.randomColor();
    this.refCounter = 0;
    this.name = props.name || "Tree";

    // this.root = this.createNode({
    //     value: 0,
    //     left: this.createNode({
    //         value: 1,
    //         left: this.createNode({value: 3}),
    //         right: this.createNode({value: 4})
    //     }),
    //     right: this.createNode({
    //         value: 2,
    //         right: this.createNode({value: 5})
    //     })
    // });
    this.root = this.createNode({value: 0});
  }

  static createRandomTree(props) {
    const tree = new Tree(props);
    tree.makeRandomBranch(tree.root, props.depth || 2, props.maxChildCount || 3);
    return tree;
  }

  makeRandomBranch(node, depth, maxChildCount) {
    if(depth == 0) {
      return;
    }

    var count = Math.ceil(Math.random() * maxChildCount);

    while(count--) {
      node.addChild(this.createNode({ value: Math.floor(Math.random()*100) }));
      this.makeRandomBranch(node.children[node.children.length - 1], depth - 1, maxChildCount);
    }
  }

  createNode(props) {
    props.ref = this.name + "-" + this.refCounter++;
    props.tree = this;

    var node = new Node(props);
    //node.touch();

    return node;
  }

  getNodeByRef(ref) {
    return this._getNodeByRef(ref, this.root);
  }

  //     _getNodeByRef(ref, node) {
  //         if(node === null || node === undefined) {
  //             return null;
  //         }

  //         if(node.ref == ref) {
  //             return node;
  //         }

  //         var left = this._getNodeByRef(ref, node.left);
  //         if(left) return left;

  //         var right = this._getNodeByRef(ref, node.right);
  //         if(right) return right;

  //         return null;
  //     }


  _getNodeByRef(ref, node) {
    if(node === null || node === undefined) {
      return null;
    }

    if(node.ref == ref) {
      return node;
    }

    for(var i = 0; i < node.children.length; ++i) {
      var c = node.children[i];
      var n = this._getNodeByRef(ref, c);
      if(n !== null) {
        return n;
      }
    }

    return null;
  }

  getInfo() {
    return this.name;
  }

  tick(dt) {
    this.tickNode(dt, this.root);
  }

  tickNode(dt, node) {
    if(node === null || node === undefined) {
      return;
    }

    node.tick(dt);

    node.children.forEach((c) => {
      this.tickNode(dt, c);
    });
  }

  render(pos, ctx) {
    const offset = 200;
    const fontSize = 13;
    pos.x += offset;
    ctx.font = fontSize + "px Arial";
    ctx.fillText(this.getInfo(), pos.x - 10, pos.y - 20);

    this.root.render(pos, ctx, 1);
  }
}

export default Tree;
