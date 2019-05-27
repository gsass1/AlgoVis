import Struct from './Struct.js'

class Node {
    constructor(props) {
        this.value = props.value;
        this.left = props.left;
        this.right = props.right;
    }

    render(pos, ctx) {
        const size = 40;
        const fontSize = 12;

        ctx.fillStyle = "#ff0000";
        ctx.fillRect(pos.x, pos.y, size, size);

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

            ctx.strokeStyle = "#ff0000";
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

            ctx.strokeStyle = "#ff0000";
            ctx.stroke();

            this.right.render(rightPos, ctx);
        }
    }
}

class Tree extends Struct {
    constructor(props) {
        super(props);

        this.name = props.name || "Tree";

        this.root = new Node({
            value: 0,
            left: new Node({
                value: 1,
                left: new Node({value: 3}),
                right: new Node({value: 4})
            }),
            right: new Node({
                value: 2,
                right: new Node({value: 5})
            })
        });
    }

    getInfo() {
        return this.name;
    }

    render(pos, ctx) {
        const fontSize = 13;
        ctx.font = fontSize + "px Arial";
        ctx.fillText(this.getInfo(), pos.x - 10, pos.y - 20);

        this.root.render(pos, ctx);
    }
}

export default Tree;