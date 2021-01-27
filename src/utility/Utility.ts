// Data
const paletteMap = new Map();


// Local Function
// https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
function convertHSVtoRGB(h: any, s: any, v: any) {
  let r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    s = h.s, v = h.v, h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255)
  ]
}


// Global Function
export function getTaskName(tagList: any) {
  // sort the tag based on lex order
  tagList = Array.from(tagList);
  tagList.sort();

  // construct string
  let name = "";
  for (let i = 0; i < tagList.length; i++) {

    // skip empty tag (although it normal will not occur)
    if (tagList[i].length == 0) continue;

    // skip special tag
    // *
    // `
    if (tagList[i][0] == '*') continue;
    if (tagList[i][0] == '`') continue;

    // add ',
    if (name.length != 0) {
      name += ", ";
    }

    // actual add tag
    name += tagList[i];
  }

  return name;
}


export function getTotalTime(timeList: any) {
  // CONFIG
  let result = 0;

  // CORE
  for (const item of timeList) {
    result += (item[2] - item[0]) * 60 + (item[3] - item[1]);
  }

  // RET
  return result / 60;
}


export function getPalette(key: any) {
  // check if tag name is empty or not (although normally will not occur)
  if (key.length == 0)  return "rgb(150, 150, 150)";
  if (key[0] == '*')    return "rgb(150, 150, 150)";
  if (key[0] == '`')    return "rgb(150, 150, 150)";

  // first check if exist in palette list
  // if not exist, then create the key and value
  if (!paletteMap.has(key)) {

    // generate random rgb
    // HSV
    // h: hue
    // s: saturation
    // v: value (brightness?)
    let h = Math.random();
    let s = 1.0;
    let v = 0.8;

    const color = convertHSVtoRGB(h, s, v);
    const rgb   = 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ', 0.5)';

    // create key and value
    paletteMap.set(key, rgb);
  }

  // return string of color code
  return paletteMap.get(key);
}


// https://stackoverflow.com/questions/2998784/how-to-output-numbers-with-leading-zeros-in-javascript
export function pad(num: any, size: any) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}
