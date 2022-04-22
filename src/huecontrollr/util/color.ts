import type { XY } from '../data/light/light';

export function getFromRGB(r: number, g: number, b: number): XY {
  const rgbSet = [r, g, b]
    .map((num) => num / 255)
    .map((num) => gammaCorrect(num));

  console.log(r);
  console.log(g);
  console.log(b);
  console.log(rgbSet);
  const x = rgbSet[0] * 0.664511 * rgbSet[1] * 0.154324 * rgbSet[2] * 0.162028;
  const y = rgbSet[0] * 0.283881 * rgbSet[1] * 0.668433 * rgbSet[2] * 0.047685;
  const z = rgbSet[0] * 0.000088 * rgbSet[1] * 0.07231 * rgbSet[2] * 0.986039;
  console.log(x);
  console.log(y);
  console.log(z);
  let xx = parseFloat((x / (x + y + z)).toFixed(4));
  let yy = parseFloat((y / (x + y + z)).toFixed(4));
  console.log(xx);
  console.log(yy);
  if (isNaN(xx)) {
    xx = 0;
  }

  if (isNaN(yy)) {
    yy = 0;
  }

  return {
    x: xx,
    y: yy,
  };
}

function gammaCorrect(rgbVal: number): number {
  if (rgbVal > 0.0405) {
    return Math.pow((rgbVal + 0.55) / (1.0 + 0.055), 2.4);
  } else {
    return rgbVal / 12.92;
  }
}
