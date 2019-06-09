import Constants from './Constants';
import Position from './Position';
import Struct from './Struct';
import Util from './Util';

const DIRTY_TIME = 1.0;
const DIRTYCOLOR = { r: 0, g: 255, b: 0 };

class Vertex {
  constructor(props) {
    this.id = props.id;
    this.name = props.name || "";
    this.graph = props.graph;
    this.pos = props.pos || null;
  }

  getRef() {
    return this.graph.name + "-v-" + this.id;
  }
}

class Edge {
  constructor(props) {
    this.v0 = props.v0;
    this.v1 = props.v1;

    this.id = props.id;
    this.name = props.name || "";
    this.graph = props.graph;

    this.weight = props.weight || 0;

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
    this.dirty = true;
    this.dirtyTicks = DIRTY_TIME;
  }

  getRef() {
    return this.graph.name + "-e-" + this.id;
  }

  getDirtyPercentage() {
    return 1.0 - this.dirtyTicks / DIRTY_TIME;
  }
}

class Graph extends Struct {
  constructor(props) {
    super(props);

    this.vertexRefCounter = 0;
    this.edgeRefCounter = 0;

    this.name = props.name;
    this.vertices = [];
    this.edges = [];
  }

  createVertex(props) {
    var vertex = new Vertex({ ...props, id: this.vertexRefCounter++, graph: this });
    this.vertices.push(vertex);
    return vertex;
  }

  createEdge(props) {
    var edge = new Edge({ ...props, id: this.edgeRefCounter++, graph: this });
    this.edges.push(edge);
    return edge;
  }

  getVertexByRef(ref) {
    for(var i = 0; i < this.vertices.length; ++i) {
      const v = this.vertices[i];

      if(v.getRef() === ref) {
        return v;
      }
    }

    return null;
  }

  getEdgeByRef(ref) {
    for(var i = 0; i < this.edges.length; ++i) {
      const e = this.edges[i];

      if(e.getRef() === ref) {
        return e;
      }
    }

    return null;
  }

  getInfo() {
    return this.name;
  }

  buildAdjacencyList() {
    if(this.vertices.length <= 1) return [];

    var list = []

    for(var i = 0; i < this.vertices.length; ++i) {
      list.push(new Array(this.vertices.length));

      for(var j = 0; j < this.vertices.length; ++j) {
        list[i][j] = null;
      }
    }

    for(var i = 0; i < this.edges.length; ++i) {
      const e = this.edges[i];

      /* TODO: this will not work when we can remove vertices */
      var v0Index = e.v0.id;
      var v1Index = e.v1.id;

      list[v0Index][v1Index] = e;
    }

    return list;
  }

  tick(dt) {
    this.edges.forEach((e) => e.tick(dt));
  }

  render(pos, renderer) {
    var adjList = this.buildAdjacencyList();
    const size = 10 * Constants.SCALE;

    var verticesToDraw = [];
    var edgesToDraw = [];

    const getVertexGridPos = (i) => {
      //const scalar = 150 * Constants.SCALE;
      const scalar = 150;
      return new Position((i%5)*scalar, Math.floor(i/5)*scalar);
    };



    for(var i = 0; i < adjList.length; ++i) {
      var list = adjList[i];
      
      const v0 = this.vertices[i];
      const pos0 = (v0.pos || getVertexGridPos(i)).mul(Constants.SCALE);

      /* TODO: draw v0 at pos0 */
      //drawVertex(v0, pos0);
      verticesToDraw.push({ v: v0, vertexPos: pos0 });

      for(var j = 0; j < list.length; ++j) {
        if(list[j] === null) continue;

        const edge = list[j];

        const v1 = this.vertices[j];
        const pos1 = (v1.pos || getVertexGridPos(j)).mul(Constants.SCALE);

        verticesToDraw.push({ v: v1, vertexPos: pos1 })

        /* TODO: draw v1 at pos1 */
        //drawVertex(v1, pos1);

        /* TODO draw edge */
        //drawEdge(edge, pos0, pos1);
        edgesToDraw.push({ edge, v0: pos0, v1: pos1 });
      }
    }

    edgesToDraw.forEach((e) => {
      const drawEdge = (edge, a, b) => {
        renderer.setDefaultFont(10 * Constants.SCALE);
        
        const middle = a.add((b.sub(a)).mul(0.5));
        renderer.renderText(edge.weight, middle.add(pos), { r: 255, g: 255, b: 255 }, "center");

        var color = { r: 255, g: 255, b: 255 };

        if(edge.dirty) {
          color = Util.lerpColor(DIRTYCOLOR, color, edge.getDirtyPercentage());
        }

        renderer.renderLine(a.add(pos).add(size/2, size/2), b.add(pos).add(size/2,size/2), color, 3);
      }

      drawEdge(e.edge, e.v0, e.v1);
    });

    verticesToDraw.forEach((v) => {
      const drawVertex = (vertex, vertexPos) => {
        renderer.renderFilledCircleOutlined(vertexPos.add(pos), { r: 255, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }, size);

        renderer.setDefaultFont(8 * Constants.SCALE);
        renderer.renderText(vertex.name, vertexPos.add(pos).add(size/2, size/2), { r: 255, g: 255, b: 255 }, "center");
      };

      drawVertex(v.v, v.vertexPos);
    });
  }
}

export default Graph;
