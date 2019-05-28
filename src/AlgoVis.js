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

        interp.setProperty(scope, 'listLength', interp.createNativeFunction((name, value) => {
            return interp.createPrimitive(algovis.getObject(name.data).size);
        }));

        /* Binary tree functions */
        interp.setProperty(scope, 'treeCreate', interp.createNativeFunction((name) => {
            algovis.addObject(new Tree({name: name.data, color: Util.randomColor()}));
            return name;
        }));

        interp.setProperty(scope, 'treeRoot', interp.createNativeFunction((name) => {
            const tree = algovis.getObject(name.data);
            const node = tree.root;

            node.touch();

            return interp.createPrimitive(node.ref);
        }));

        interp.setProperty(scope, 'nodeLeft', interp.createNativeFunction((nodeRef) => {
            const objName = getTreeFromNodeRef(nodeRef.data);
            const tree = algovis.getObject(objName);
            const node = tree.getNodeByRef(nodeRef.data);

            if(node.left) {
                node.left.touch();
                return interp.createPrimitive(node.left.ref);
            }

            return interp.createPrimitive(-1);
        }));

        interp.setProperty(scope, 'nodeRight', interp.createNativeFunction((nodeRef) => {
            const objName = getTreeFromNodeRef(nodeRef.data);
            const tree = algovis.getObject(objName);
            const node = tree.getNodeByRef(nodeRef.data);

            if(node.right) {
                node.right.touch();
                return interp.createPrimitive(node.right.ref);
            }

            return interp.createPrimitive(-1);
        }));

        interp.setProperty(scope, 'nodeValue', interp.createNativeFunction((nodeRef) => {
            const objName = getTreeFromNodeRef(nodeRef.data);
            const tree = algovis.getObject(objName);
            const node = tree.getNodeByRef(nodeRef.data);

            node.touch();

            return interp.createPrimitive(node.value);
        }));

        interp.setProperty(scope, 'nodeAddLeft', interp.createNativeFunction((nodeRef, value) => {
            const objName = getTreeFromNodeRef(nodeRef.data);
            const tree = algovis.getObject(objName);
            const node = tree.getNodeByRef(nodeRef.data);

            node.left = tree.createNode({ value: value });
            return interp.createPrimitive(node.left.ref);
        }));

        interp.setProperty(scope, 'nodeAddRight', interp.createNativeFunction((nodeRef, value) => {
            const objName = getTreeFromNodeRef(nodeRef.data);
            const tree = algovis.getObject(objName);
            const node = tree.getNodeByRef(nodeRef.data);

            node.right = tree.createNode({ value: value });
            return interp.createPrimitive(node.right.ref);
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

            var stateStack = this.interpreter.stateStack[0];
            if (stateStack.scope && stateStack.scope.properties) {
                for (var key in stateStack.scope.properties) {
                    var value = stateStack.scope.properties[key];

                    if (key !== "Infinity" && key !== "NaN" && (value.type == "number" || value.type == "string")) {
                        var elem = document.getElementById("var" + key);
                        if (elem != null) {
                            elem.innerHTML = "<td>" + key + "</td><td>" + value.data + "</td></tr>";
                        } else {
                            document.getElementById("varTableBody").innerHTML += "<tr id=var" + key + "><td>" + key + "</td><td>" + value.data + "</td></tr>";
                        }
                    }
                }
            }

            try {
                var step = this.interpreter.step();
            } catch(e) {
                alert(e);
                this.running = false;
            }

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
            x: 400,
            y: 200,
        }

        this.objects.forEach((object) => {
            object.render(pos, ctx);
            pos.y += 200;
        });
    }
}

export default AlgoVis;