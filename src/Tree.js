import Position from './Position'
import Struct from './Struct'
import Touchable from './Touchable'
import Util from './Util'

import Constants from './Constants';

const DIRTYCOLOR = { r: 0, g: 255, b: 0 };

const isLeftMost = (node, parent) => {
  if(parent === null) return true;

  for(var i = 0; i < parent.children.length; ++i) {
    if(parent.children[i] === node) {
      var pi = i;
      break;
    }
  }

  return (pi == 0 || (parent.children[pi-1] == null));
};

class Node extends Touchable {
  constructor(props) {
    super(props);

    this.ref = props.ref;
    //this.value = Math.ceil(Math.random()*100);
    this.value = props.value;
    this.children = [];
    this.left = props.left || null;
    this.right = props.right || null;

    this.x = 0;
    this.mod = 0;

    if(this.left) this.children.push(this.left);
    if(this.right) this.children.push(this.right);

    this.tree = props.tree;
  }

  addChild(node) {
    this.children.push(node);
  }

  tick(dt) {
    super.tick(dt);
  }

  isLeaf() {
    return this.children.length == 0;
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

    if(node == null && this.children.length == 1) {
      this.children = [];
    }
  }

  setRight(node) {
    this.children[1] = node;

    if(node == null && this.children.length == 1) {
      this.children = [];
    } else if(node == null && this.children.length == 2) {
      if(this.children[0]) {
        this.children = [this.children[0]];
      } else {
        this.children = [];
      }
    }
  }

  getXPos(offset) {
    return offset + this.x * size;
  }

  render(pos, r, depth) {
    const size = 20*Constants.SCALE;
    const fontSize = 12*Constants.SCALE;

    if(this.dirty) {
      var color = Util.lerpColor(Util.invertColor(this.tree.color), this.tree.color, this.getDirtyPercentage());
    } else {
      var color = this.tree.color;
    }

    var n = this.children.length;

    const targetPos = new Position(pos.x + (this.x?this.x:0) * 80.0 * Constants.SCALE, pos.y);

    for(var i = 0; i < this.children.length; ++i) {
      var child = this.children[i];

      if(child === null || child === undefined) {
        continue;
      }

      var x = child.x * 80.0 * Constants.SCALE;

      const lineTo = new Position(pos.x + x, pos.y + 80*Constants.SCALE);
      const childPos = new Position(pos.x, pos.y + 80*Constants.SCALE);

      r.renderLine(targetPos.add(size/2, size/2), lineTo.add(size/2, size/2), color, 3);

      child.render(childPos, r, depth + 1);
    }

    r.renderFilledCircleOutlined(targetPos, color, {r: 255, g: 255, b:255}, size);

    r.setDefaultFont(fontSize);
    r.renderText(this.value, targetPos.add(size/2, size/1.5), { r: 255, g: 255, b: 255 }, "center");
  }
}

class Tree extends Struct {
  constructor(props) {
    super(props);

    this.color = props.color || Util.randomColorLower();
    this.refCounter = 0;
    this.name = props.name || "Tree";
    this.children = [];
    this.binary = props.binary || false;

    this.root = this.createNode({value: 0});
  }

  static createRandomTree(props) {
    const tree = new Tree(props);
    tree.root.value = Math.ceil(Math.random()*100);
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

  checkForConflicts(node) {
    var minDistance = 5;
    var shiftValue = 0;

    var nodeContour = [];
    this.getLeftContour(node, 0, nodeContour);

    var p = this.findParentOf(node, this.root);

    var pi = -1;

    for(var i = 0; i < p.children.length; ++i) {
      if(p.children[i] === node) {
        pi = i;
        break;
      }
    }

    if(pi == -1)  {
      throw new Exception("oopsie");
    }

    var siblingIndex = pi - 1;
    var sibling = p.children[siblingIndex];

    while (sibling !== null && sibling !== undefined && sibling != node)
    {
      var siblingContour = [];
      this.getRightContour(sibling, 0, siblingContour);

      for (var level = this.getNodeY(node.Y) + 1; level <= Math.min(siblingContour.length, nodeContour.length); ++level)
      {
        var nodeLevel = nodeContour[level] ? nodeContour[level] : 0;
        var siblingLevel = siblingContour[level] ? siblingContour[level] : 0;

        var distance = nodeLevel - siblingLevel;
        if (distance + shiftValue < minDistance)
        {
          shiftValue = minDistance - distance;
        }
      }

      if (shiftValue > 0)
      {
        node.x += shiftValue;
        node.mod += shiftValue;

        shiftValue = 0;
      }

      sibling = p.children[++siblingIndex];
    }
  }

  calcInitialX(node) {
    for(var i = 0; i < node.children.length; ++i) {
      var c = node.children[i];

      if(c) {
        this.calcInitialX(c);
      }
    }

    //console.log(node);

    if(node !== this.root) {
      var p = this.findParentOf(node, this.root);

      var pi = -1;

      for(var i = 0; i < p.children.length; ++i) {
        if(p.children[i] === node) {
          pi = i;
          break;
        }
      }

      if(pi == -1)  {
        throw new Exception("oopsie");
      }
    } else {
      var pi = 0;
      var p = null;
    }

    if(node.isLeaf())  {
      /* left-most */
      if(pi == 0) {
        node.x = 0;
      } else {
        if(p.children[pi - 1]) {
          node.x = p.children[pi - 1].x + 1 + 1;
        } else {
          node.x = 1 + 1;
        }
      }
    } else if(node.children.length == 1) {
      if(isLeftMost(node, p)) {
        node.x = node.children[0].x + 1;
      } else {
        node.x = p.children[pi - 1].x + 1 + 1;
        node.mod = node.x - node.children[0].x;
      } 
    } else if(node.children.length == 2 && (node.children[0] === null || node.children[0] === undefined)) {
      if(isLeftMost(node, p)) {
        node.x = node.children[1].x - 1;
      } else {
        node.x = p.children[pi - 1].x + 1 + 1;
        node.mod = node.x - node.children[1].x;
      } 
    } else if(node.children[0]) {
      var leftChild = node.children[0];
      var rightChild = node.children[node.children.length - 1];

      var mid = (leftChild.x + rightChild.x) / 2.0;

      if(isLeftMost(node, p))
      {
        node.x = mid;
      }
      else
      {
        node.x = p.children[pi - 1].x + 1 + 1;
        node.mod = node.x - mid;
      }
    }

    if(node.children.length > 0 && pi != 0) {
      this.checkForConflicts(node);
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

  getNodeY(node) {
    return this._getNodeY(node, this.root);
  }

  _getNodeY(node, root) {
    if(node === this.root) {
      return 0;
    }

    for(var i = 0; i < root.children.length; ++i) {
      if(root.children[i]) {
        if((root.children[i] === node)) {
          return 1;
        } else {
          return 1 + this.getNodeY(root.children[i], node);
        }
      }
    }

    return 0;
  }

  getLeftContour(node, modSum, values) {
    var y = this.getNodeY(node);

    if(values[y] === null || values[y] === undefined) {
      values[y] = node.x + modSum;
    } else {
      values[y] = Math.min(values[y], node.x + modSum);
    }

    modSum += node.mod;

    for(var i = 0; i < node.children.length; ++i) {
      if(node.children[i]) {
        this.getLeftContour(node.children[i], modSum, values);
      }
    }
  }

  getRightContour(node, modSum, values) {
    var y = this.getNodeY(node);

    if(values[y] === null || values[y] === undefined) {
      values[y] = node.x + modSum;
    } else {
      values[y] = Math.max(values[y], node.x + modSum);
    }

    modSum += node.mod;

    for(var i = 0; i < node.children.length; ++i) {
      if(node.children[i]) {
        this.getRightContour(node.children[i], modSum, values);
      }
    }
  }

  checkAllChildrenOnScreen(rootNode) {
    var nodeContour = [];

    this.getLeftContour(rootNode, 0, nodeContour);

    var shiftAmount = 0;
    for(var y = 0; y < nodeContour.length; ++y) {
      if(nodeContour[y] + shiftAmount < 0) {
        shiftAmount = nodeContour[y] * -1;
      }
    }

    if(shiftAmount > 0) {
      rootNode.x = (rootNode.x ? rootNode.x : 0);
      rootNode.x += shiftAmount;

      rootNode.mod = (rootNode.mod ? rootNode.mod : 0);
      rootNode.mod += shiftAmount;
    }
  }

  calculateFinalX(node, modSum) {
    node.x += modSum;
    modSum += node.mod;

    for(var i = 0; i < node.children.length; ++i) {
      if(node.children[i]) {
        this.calculateFinalX(node.children[i], modSum);
      }
    }
  }

  resetX(node) {
    node.x = 0;
    node.mod = 0;

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
    this.checkAllChildrenOnScreen(this.root);
    this.calculateFinalX(this.root, 0);
  }

  render(pos, renderer) {
    const offset = 200;
    const fontSize = 13 * Constants.SCALE;

    pos.x += offset;

    renderer.setDefaultFont(fontSize);
    renderer.renderText(this.getInfo(), pos.sub(10, 20), this.color);

    this.prepareTreeRender();
    this.root.render(pos, renderer, 1);
  }
}

export default Tree;
