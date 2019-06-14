const lerpf = (a, b, t) => {
  return ((a) + ((b) - (a)) * (t));
};

const defaultFontStack = ["Liberation Mono", "Inconsolata"]
  .map((x) => { return `\"${x}\"`; })
  .join(",");

export default {
  lerpf,
  smoothstep: (a) => {
    return ((a) * (a) * (3.0 - 2.0 * (a)));
  },
  lerpColor: (a, b, t) => {
    return {
      r: lerpf(a.r, b.r, t),
      g: lerpf(a.g, b.g, t),
      b: lerpf(a.b, b.b, t),
    }
  },
  colorToCSS: (color) => {
    return `rgb(${Math.floor(color.r)}, ${Math.floor(color.g)}, ${Math.floor(color.b)})`
  },
  randomColor: () => {
    return {
      r: Math.floor(Math.random()*255),
      g: Math.floor(Math.random()*255),
      b: Math.floor(Math.random()*255),
    }
  },
  randomColorLower: () => {
    return {
      r: Math.floor(Math.random()*64),
      g: Math.floor(Math.random()*64),
      b: Math.floor(Math.random()*128),
    }
  },
  randomColorUpper: () => {
    return {
      r: Math.floor(Math.random()*128)+127,
      g: Math.floor(Math.random()*128)+127,
      b: Math.floor(Math.random()*128)+127,
    }
  },
  cssFont: (size, font) => {
    return size + "px " + font;
  },
  defaultFont: (size) => {
    return size + "px " + defaultFontStack;
  },
  clamp: (value, min, max) => {
    return Math.min(Math.max(value, min), max);
  },
  invertColor: (c) => {
    return {
      r: 255 - c.r,
      g: 255 - c.g,
      b: 255 - c.b
    };
  },
  shadeColor: (c) => {
    return {
      r: c.r * 0.75,
      g: c.g * 0.75,
      b: c.b * 0.75
    };
  }
};
