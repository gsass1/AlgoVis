import Constants from './Constants';
import Util from './Util';

class Renderer {
  constructor(props) {
    this.canvas = props.canvas;
    this.ctx = this.canvas.getContext("2d");
  }

  fillScreen(color) {
    this.ctx.fillStyle = Util.colorToCSS(color);;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  renderLine(from, to, color, lineWidth) {
    lineWidth = lineWidth || 1;

    this.ctx.beginPath();

    this.ctx.moveTo(from.x, from.y);
    this.ctx.lineTo(to.x, to.y);

    this.ctx.closePath();

    this.ctx.strokeStyle = Util.colorToCSS(color);
    this.ctx.lineWidth = lineWidth;
    this.ctx.stroke();
  }

  renderFilledCircle(pos, color, radius) {
    this.ctx.beginPath();

    this.ctx.arc(pos.x + radius / 2, pos.y + radius / 2, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = Util.colorToCSS(color);
    this.ctx.fill();

    this.ctx.closePath();
  }

  renderFilledCircleOutlined(pos, color, outlineColor, radius) {
    this.ctx.beginPath();

    this.ctx.arc(pos.x + radius / 2, pos.y + radius / 2, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = Util.colorToCSS(color);
    this.ctx.fill();

    this.ctx.lineWidth = 2 * Constants.SCALE;
    this.ctx.strokeStyle = Util.colorToCSS(outlineColor);
    this.ctx.stroke();

    this.ctx.closePath();
  }

  renderFilledRect(pos, dim, color) {
    this.ctx.fillStyle = Util.colorToCSS(color);;
    this.ctx.fillRect(pos.x, pos.y, dim.w, dim.h);
  }

  setDefaultFont(size) {
    this.ctx.font = Util.defaultFont(size);
  }

  renderText(str, pos, color, align) {
    color = color || { r: 255, g: 255, b: 255 };
    align = align || "left";

    this.ctx.textAlign = align;
    this.ctx.fillStyle = Util.colorToCSS(color);
    this.ctx.fillText(str, pos.x, pos.y);
  }
}

export default Renderer;
