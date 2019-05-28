import Struct from './Struct.js'
import Util from './Util.js'

const DIRTY_TIME = 1.0;

const DIRTYCOLOR = { r: 0, g: 255, b: 0 };

class Node {
    constructor(props) {
        this.ref = props.ref;
        this.value = props.value || 0;
        this.left = props.left || null;
        this.right = props.right || null;
        this.tree = props.tree;
        this.dirty = false;
        this.dirtyTicks = 0;
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
        this.dirty = true;
        this.dirtyTicks = DIRTY_TIME;
    }

    render(pos, ctx) {
        const size = 40;
        const fontSize = 12;

        if(this.dirty) {
            var color = Util.lerpColor(DIRTYCOLOR, this.tree.color, this.getDirtyPercentage());
        } else {
            var color = this.tree.color;
        }

        ctx.fillStyle = Util.colorToCSS(color);
        ctx.fillRect(pos.x, pos.y, size, size);

        //ctx.beginPath();
        //ctx.arc(pos.x+size/2, pos.y+size/2, size, 0, 2 * Math.PI);
        //ctx.stroke(); 

        ctx.font = fontSize + "px Arial";
        ctx.fillStyle = "#000";
        ctx.fillText(this.value, pos.x + size/2, pos.y + size/2);

        const dist = 80;
        if(this.left) {
            const leftPos = {
                x: pos.x - dist,
                y: pos.y + dist
            };

            ctx.beginPath();
            ctx.moveTo(pos.x+size/2, pos.y+size/2);
            ctx.lineTo(leftPos.x+size/2, leftPos.y+size/2);
            ctx.closePath();

            ctx.strokeStyle = Util.colorToCSS(this.tree.color);
            ctx.stroke();

            this.left.render(leftPos, ctx);
        }

        if(this.right) {
            const rightPos = {
                x: pos.x + dist,
                y: pos.y + dist
            };

            ctx.beginPath();
            ctx.moveTo(pos.x+size/2, pos.y+size/2);
            ctx.lineTo(rightPos.x+size/2, rightPos.y+size/2);
            ctx.closePath();

            ctx.strokeStyle = Util.colorToCSS(this.tree.color);
            ctx.stroke();

            this.right.render(rightPos, ctx);
        }
    }
}

class Tree extends Struct {
    constructor(props) {
        super(props);

        this.color = props.color || Util.randomColor();
        this.refCounter = 0;
        this.name = props.name || "Tree";

        this.root = this.createNode({
            value: 0,
            left: this.createNode({
                value: 1,
                left: this.createNode({value: 3}),
                right: this.createNode({value: 4})
            }),
            right: this.createNode({
                value: 2,
                right: this.createNode({value: 5})
            })
        });
    }

    createNode(props) {
        props.ref = this.name + "-" + this.refCounter++;
        props.tree = this;

        var node = new Node(props);
        node.touch();

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

        var left = this._getNodeByRef(ref, node.left);
        if(left) return left;

        var right = this._getNodeByRef(ref, node.right);
        if(right) return right;

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

        this.tickNode(dt, node.left);
        this.tickNode(dt, node.right);
    }

    render(pos, ctx) {
        const fontSize = 13;
        ctx.font = fontSize + "px Arial";
        ctx.fillText(this.getInfo(), pos.x - 10, pos.y - 20);

        this.root.render(pos, ctx);
    }
}

export default Tree;