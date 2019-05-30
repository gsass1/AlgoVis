const lerpf = (a, b, t) => {
  return ((a) + ((b) - (a)) * (t));
};

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
      g: Math.floor(Math.random()*200),
      b: Math.floor(Math.random()*255),
    }
  }
};
