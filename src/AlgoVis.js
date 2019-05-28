import Interpreter from 'js-interpreter'
import List from './List';
import Util from './Util';
import Tree from './Tree';

let testCode = document.getElementById("codearea").value;


const deepCopy = obj => {
    return JSON.parse(JSON.stringify(obj))
};

/**
 * 
 * @param {!String} ref 
 */
const getTreeFromNodeRef = ref => {
    return ref.split("-")[0];
}

const createInterpreter = (algovis, code) => {
    return new Interpreter(code, (interp, scope) => {
        interp.setProperty(scope, 'log', interp.createNativeFunction((msg) => {
            console.log(msg);
        }));

        /* List functions */
        interp.setProperty(scope, 'listCreate', interp.createNativeFunction((name, size) => {
            algovis.addObject(new List({name: name.data, size: size, color: Util.randomColor()}));
            return name;
        }));

        interp.setProperty(scope, 'listGet', interp.createNativeFunction((name, i) => {
            return interp.createPrimitive(algovis.getObject(name.data).get(i));
        }));

        interp.setProperty(scope, 'listSet', interp.createNativeFunction((name, i, value) => {
            algovis.getObject(name.data).set(i, value);
        }));

        interp.setProperty(scope, 'listSwap', interp.createNativeFunction((name, a, b) => {
            algovis.getObject(name.data).swap(a, b);
        }));

        interp.setProperty(scope, 'listAdd', interp.createNativeFunction((name, value) => {
            algovis.getObject(name.data).add(value);
        }));

        interp.setProperty(scope, 'listSize', interp.createNativeFunction((name, value) => {
            return interp.createPrimitive(algovis.getObject(name.data).size);
        }));

        /* Binary tree functions */
        interp.setProperty(scope, 'treeCreate', interp.createNativeFunction((name) => {
            algovis.addObject(new Tree({name: name.data, color: Util.randomColor()}));
            return name;
        }));

        interp.setProperty(scope, 'treeRoot', interp.createNativeFunction((name) => {
            return interp.createPrimitive(algovis.getObject(name.data).root.ref);
        }));

        interp.setProperty(scope, 'nodeLeft', interp.createNativeFunction((nodeRef) => {
            const objName = getTreeFromNodeRef(nodeRef.data);
            const tree = algovis.getObject(objName);
            const node = tree.getNodeByRef(nodeRef.data);

            if(node.left) {
                return interp.createPrimitive(node.left.ref);
            }

            return -1;
        }));

        interp.setProperty(scope, 'nodeRight', interp.createNativeFunction((nodeRef) => {
            const objName = getTreeFromNodeRef(nodeRef.data);
            const tree = algovis.getObject(objName);
            const node = tree.getNodeByRef(nodeRef.data);

            if(node.right) {
                return interp.createPrimitive(node.right.ref);
            }

            return -1;
        }));

        interp.setProperty(scope, 'nodeValue', interp.createNativeFunction((nodeRef) => {
            const objName = getTreeFromNodeRef(nodeRef.data);
            const tree = algovis.getObject(objName);
            const node = tree.getNodeByRef(nodeRef.data);

            return interp.createPrimitive(node.value);
        }));
    })
}

const createSelection = (start, end) => {
    var field = document.getElementById('codearea');

    /*
    for (; start >= 1; start--) {
        if (field.value[start] == '\r' || field.value[start] == '\n') {
            start++;
            break;
        }
    }


    for (end = start; end < field.value.length; end++) {
        if (field.value[end] == '\r' || field.value[end] == '\n') {
            break;
        }
    }
    */

    if (field.createTextRange) {
        var selRange = field.createTextRange();
        selRange.collapse(true);
        selRange.moveStart('character', start);
        selRange.moveEnd('character', end);
        selRange.select();
    } else if (field.setSelectionRange) {
        field.setSelectionRange(start, end);
    } else if (field.selectionStart) {
        field.selectionStart = start;
        field.selectionEnd = end;
    }
    field.focus();
}

class AlgoVis {
    constructor(props) {
        this.reset();
    }

    createInterpreter() {
        this.interpreter = createInterpreter(this, document.getElementById("codearea").value);
    }

    reset() {
        this.objects = [];
        this.interpreter = null;
        this.running = false;
    }

    setupInterpreter() {
        this.reset();
        this.createInterpreter();
    }

    run() {
        this.setupInterpreter();
        this.running = true;
    }

    pause() {
        this.running = false;
    }

    step() {
        if (this.interpreter !== null) {
            if (this.interpreter.stateStack.length) {
                var node =
                    this.interpreter.stateStack[this.interpreter.stateStack.length - 1].node;
                var start = node.start;
                var end = node.end;
            } else {
                var start = 0;
                var end = 0;
            }
            createSelection(start, end);

            let step = this.interpreter.step();
            if(!step) {
                this.running = false;
            }
        }
    }

    addObject(object) {
        this.objects.push(object);
    }

    getObject(name) {
        for(var i = 0; i < this.objects.length; ++i) {
            if(this.objects[i].name === name) {
                return this.objects[i];
            }
        }

        return null;
    }

    tick(dt) {
        this.objects.forEach((object) => {
            object.tick(dt);
        });
    }

    render(ctx) {
        let pos = {
            x: 200,
            y: 200,
        }

        this.objects.forEach((object) => {
            object.render(pos, ctx);
            pos.y += 200;
        });
    }
}

export default AlgoVis;