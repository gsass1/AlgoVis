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
    this.children[1] = node;
  }

  getXPos(offset) {
    return offset + this.x * size;
  }

  calculateLeftContour() {
    var arr = [];

    return this._calculateLeftContour(this, arr);
  }

  _calculateLeftContour(node, arr) {
    for(var i = 0; i < node.children.length; ++i) {
      if(node.children[i]) {
        arr.push(node.children[i].x);
        this._calculateLeftContour(node.children[i], arr);
        break;
      }
    }

    return arr;
  }

  calculateRightContour() {
    var arr = [];

    return this._calculateRightContour(this, arr);
  }

  _calculateRightContour(node, arr) {
    for(var i = node.children.length - 1; i >= 0; --i) {
      if(node.children[i]) {
        arr.push(node.children[i].x);
        this._calculateRightContour(node.children[i], arr);
        break;
      }
    }

    return arr;
  }

  adjustX(offset) {
    this.x += offset;

    for(var i = 0; i < this.children.length; ++i) {
      var child = this.children[i];
      if(child) {
        child.adjustX(offset);
      }
    }
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

    var targetPos = {
      x: pos.x + (this.x?this.x:0) * 80.0 * Constants.SCALE,
      y: pos.y
    };

    for(var i = 0; i < this.children.length; ++i) {
      var child = this.children[i];

      if(child === null || child === undefined) {
        continue;
      }

      var x = child.x * 80.0 * Constants.SCALE;

      const lineTo = {
        x: pos.x + x,
        y: pos.y + 80*Constants.SCALE
      };

      const childPos = {
        x: pos.x,
        y: pos.y + 80*Constants.SCALE
      };

      ctx.beginPath();
      ctx.moveTo(targetPos.x+size/2, targetPos.y+size/2);
      ctx.lineTo(lineTo.x+size/2, lineTo.y+size/2);
      ctx.closePath();

      ctx.strokeStyle = Util.colorToCSS(color);
      ctx.lineWidth = 3;
      ctx.stroke();

      child.render(childPos, ctx, depth + 1);
    }

    ctx.beginPath();
    ctx.arc(targetPos.x+size/2, targetPos.y+size/2, size, 0, 2 * Math.PI);
    ctx.fillStyle = Util.colorToCSS(color);
    ctx.fill();

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#fff";
    ctx.stroke();
    ctx.closePath();

    ctx.font = fontSize + "px Arial";
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.fillText(this.value, targetPos.x + size/2, targetPos.y + size/1.5);

  }
}

class Tree extends Struct {
  constructor(props) {
    super(props);

    this.color = props.color || Util.randomColor();
    this.refCounter = 0;
    this.name = props.name || "Tree";
    this.children = [];

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
    this.children.push(node);
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

//   forEachPreOrder(cb) {
//     _forEachPreOrder(this.root, cb):
//   }

//   _forEachPreOrder(node, cb) {
//     cb(node);

//     for(var i = 0; i < node.children.length; ++i) {
//       var c = node.children[i];

//       if(c) {
//         this._forEachPreOrder(c, cb);
//       }
//     }
//   }

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

  findParentOf(node, root) {
    for(var i = 0; i < root.children.length; ++i) {
      if(node == root.children[i]) {
        return root;
      }
    }

    for(var i = 0; i < root.children.length; ++i) {
      if(root.children[i]) {
        var p = this.findParentOf(node, root.children[i]);
        if(p) {
          return p;
        }
      }
    }

    return null;
  }

  calcInitialX(node) {
    for(var i = 0; i < node.children.length; ++i) {
      var c = node.children[i];

      if(c) {
        this.calcInitialX(c);
      }
    }

    if(node === this.root) {
      return;
    }

    var p = this.findParentOf(node, this.root);

    if(!p && node != this.root) {
      alert("oops");
    }

    var pi = -1;
    for(var i = 0; i < p.children.length; ++i) {
      if(p.children[i] === node) {
        pi = i;
        break;
      }
    }

    if(pi < 0) {
      return;
    }

    /* left-most */
    if(pi == 0) {
      node.x = 0;
    } else {
      if(p.children[i - 1]) {
        node.x = p.children[i - 1].x + 1;
      } else {
        node.x = 0;
      }
    }
  }

  centerParents(node) {
    if(node.children.length > 1 && node.children[0]) {
      var minX = node.children[0].x;
      var maxX = node.children[node.children.length - 1].x;

      node.x = (maxX - minX) / 2.0;
    }

    for(var i = 0; i < node.children.length; ++i) {
      var child = node.children[i];
      if(child) {
        this.centerParents(child);
      }
    }
  }

  resetX(node) {
    node.x = 0;

    for(var i = 0; i < node.children.length; ++i) {
      var child = node.children[i];
      if(child) {
        this.resetX(child);
      }
    }
  }

  prepareTreeRender() {
    this.resetX(this.root);
    this.calcInitialX(this.root);
    this.centerParents(this.root);
    this.fixOverlaps(this.root);
  }

  fixOverlaps(node) {
    for(var i = 0; i < node.children.length; ++i) {
      var rightChild = node.children[i];
      if(rightChild === null || rightChild === undefined) {
        continue;
      }
      var leftContour = rightChild.calculateLeftContour();

      if(leftContour.length == 0) continue;

      for(var j = 0; j < i; ++j) {
        if(i == j) continue;

        var leftChild = node.children[j];
        if(leftChild === null || leftChild === undefined) {
          continue;
        }

        var rightContour = leftChild.calculateRightContour();

        if(rightContour.length == 0) continue;

        var minLength = Math.min(leftContour.length, rightContour.length);
        leftContour.slice(minLength);
        rightContour.slice(minLength);

        var minLeft = Math.min(leftContour);
        var maxLeft = Math.max(leftContour);

        var minRight = Math.min(rightContour);
        var maxRight = Math.max(rightContour);

        // (1, 5)
        // (2, 4)
        //
        //
        //        3-----5
        //   
        //
        //    2-----4
        //    |     |
        // 1--2--3--4--5--6--7

        if((minLeft <= maxRight) && (maxLeft <= minRight)) {
          //console.log("overlap between ", rightChild, " and ", leftChild);
          //console.log(minLeft, maxLeft);
          //console.log(minRight, maxRight);
          //rightChild.adjustX(1.5);

          var dist = Math.abs(minLeft - minRight) + Math.abs(maxLeft - maxRight) + 1;
          //console.log(dist);
          //var dist = (minRight - maxLeft) + (maxLeft - minRight)
          rightChild.adjustX(dist);
        }
      }

      this.fixOverlaps(rightChild);
    }
  }

  render(pos, ctx) {
    const offset = 200;
    const fontSize = 13;
    pos.x += offset;
    ctx.font = fontSize + "px Arial";
    ctx.fillText(this.getInfo(), pos.x - 10, pos.y - 20);

    this.prepareTreeRender();

    this.root.render(pos, ctx, 1);
  }
}

export default Tree;
