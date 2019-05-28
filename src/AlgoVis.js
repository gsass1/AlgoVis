import Interpreter from 'js-interpreter'
import List from './List';
import Util from './Util';

let testCode = document.getElementById("codearea").value;

const createInterpreter = (algovis) => {
    return new Interpreter(testCode, (interp, scope) => {
        /* List functions */
        interp.setProperty(scope, 'listCreate', interp.createNativeFunction((name, size) => {
            algovis.addObject(new List({name: name.data, size: size, color: Util.randomColor()}));
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
    })
}

class AlgoVis {
    constructor(props) {
        this.objects = [];

        this.interpreter = createInterpreter(this);
        this.interpreter.run();
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