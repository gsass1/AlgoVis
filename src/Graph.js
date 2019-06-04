import Struct from './Struct';
import Constants from './Constants';

class Vertex {
  constructor(props) {
    this.id = props.id;
    this.name = props.name || "";
    this.graph = props.graph;
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
  }

  getRef() {
    return this.graph.name + "-e-" + this.id;
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

      if(e.getRef().split("-")[2] === ref) {
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
        list[i][j] = 0;
      }
    }

    for(var i = 0; i < this.edges.length; ++i) {
      const e = this.edges[i];

      /* TODO: -this will not work when we can remove vertices */
      var v0Index = e.v0.id;
      var v1Index = e.v1.id;

      list[v0Index][v1Index] = 1;
    }

    return list;
  }

  tick(dt) {
  }

  render(pos, ctx) {
    var adjList = this.buildAdjacencyList();
    const size = 10 * Constants.SCALE;

    const getVertexGridPos = (i) => {
      const scalar = 50* Constants.SCALE;
      return {
        x: (i%5)*scalar + pos.x,
        y: Math.floor(i/5)*scalar + pos.y
      };
    };

    const drawVertex = (vertex, pos) => {
      ctx.beginPath();
      ctx.arc(pos.x+size/2, pos.y+size/2, size, 0, 2 * Math.PI);
      //ctx.fillStyle = Util.colorToCSS(color);
      ctx.fillStyle = "#ff0000";
      ctx.fill();

      //ctx.lineWidth = 2;
      //ctx.strokeStyle = "#fff";
      //ctx.stroke();
      ctx.closePath();
    };

    const drawEdge = (a, b) => {
      ctx.beginPath();

      ctx.moveTo(a.x + size/2, a.y + size/2);
      ctx.lineTo(b.x + size/2, b.y + size/2);

      ctx.closePath();

      //ctx.strokeStyle = Util.colorToCSS(color);
      ctx.strokeStyle = "#0000ff";
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    for(var i = 0; i < adjList.length; ++i) {
      var list = adjList[i];
      
      const pos0 = getVertexGridPos(i);

      const v0 = this.vertices[i];

      /* TODO: draw v0 at pos0 */
      drawVertex(v0, pos0);

      for(var j = 0; j < list.length; ++j) {
        if(list[j] === 0) continue;

        const pos1 = getVertexGridPos(j);
        const v1 = this.vertices[j];

        /* TODO: draw v1 at pos1 */
        drawVertex(v1, pos1);

        /* TODO draw edge */
        drawEdge(pos0, pos1);
      }
    }
  }
}

export default Graph;
