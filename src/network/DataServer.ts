import axios, { AxiosRequestConfig } from "axios";


// Local Data
const paletteMap          = new Map();
const registeredCallback  = new Map();
const cachedEvent         = new Map();


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


// hash
function getHash_Date(date: any) {
  return date[0] * 10000 + date[1] * 100 + date[2];
}


// caching
function cacheEvent(date: any, data: any) {
  // compute hash then save cache
  const hash = getHash_Date(date);
  cachedEvent.set(hash, data);
}


// network
function request(config: AxiosRequestConfig) {
  // create instance
  const instance = axios.create({
    baseURL: "http://localhost:5000",
    timeout: 5000
  });

  // return instance
  return instance(config);
}


function request_GetEvent_Date(date: any) {
  // compute hash
  // const hash = getDateHash(date);

  // check if data existed in the register table
  // if not existed, then do nothing
  // else, get the callbackList
  // if (!registeredCallback.has(hash)) return;

  // create request
  const instance = request({
    url: "/GetEvent_Date",
    method: "GET",
    params: {
      date: date[0] + '_' + date[1] + '_' + date[2]
    }
  });

  // get data
  instance.then(res => {
    // put on cache first
    // then call update function
    cacheEvent(date, res.data);
    update(date, true);
  });
}


function request_AddEvent(date: any, timeStart: any, timeEnd: any, tagList: any) {
  // compute tag string
  let tag_string = "";
  for (let i = 0; i < tagList.length; ++i) {
    if (i != 0) tag_string += ",";
    tag_string += tagList[i];
  }

  // create request
  const instance = request({
    url: "/AddEvent",
    method: "POST",
    params: {
      date:       date[0] + '_' + date[1] + '_' + date[2],
      time_start: timeStart[0] + '_' + timeStart[1],
      time_end:   timeEnd[0] + '_' + timeEnd[1],
      tag:        tag_string
    }
  })

  // send request
  instance.then(res => {
    update(date, false);
  }).catch();
}


function request_RmEvent(date: any, index: bigint) {
  // create request
  const instance = request({
    url: "/RmEvent",
    method: "POST",
    params: {
      date:       date[0] + '_' + date[1] + '_' + date[2],
      index:      index
    }
  })

  // send request
  instance.then(res => {
    update(date, false);
  }).catch();
}


function request_ConfigEvent(date: any, index: bigint, timeStart: any, timeEnd: any, tagList: any) {
  // compute tag string
  let tag_string = "";
  for (let i = 0; i < tagList.length; ++i) {
    if (i != 0) tag_string += ",";
    tag_string += tagList[i];
  }

  // create request
  const instance = request({
    url: "/ConfigEvent",
    method: "POST",
    params: {
      index:      index,
      date:       date[0] + '_' + date[1] + '_' + date[2],
      time_start: timeStart[0] + '_' + timeStart[1],
      time_end:   timeEnd[0] + '_' + timeEnd[1],
      tag:        tag_string
    }
  })

  // send request
  instance.then(res => {
    update(date, false);
  }).catch();
}


// Global Function
export function getPalette(key: any) {
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


export function registerCallback(date: any, callback: any) {
  // compute date hash
  const hash = getHash_Date(date);

  // register date if the date is new
  if (!registeredCallback.has(hash)) {
    registeredCallback.set(hash, []);
  }

  // register callback
  const callbackList = registeredCallback.get(hash);
  callbackList.push(callback);

  // update
  // TODO: currently is update all in the same date
  update(date);
}


export function update(date: any, isFromCache: any = true) {
  // compute hash
  const hash = getHash_Date(date);

  // check if the date is registered by some callback
  if (!registeredCallback.has(hash)) return;

  // if isFromCache == false, which mean need to get data through the network
  if (!isFromCache || !cachedEvent.has(hash)) {
    request_GetEvent_Date(date);
    return;
  }

  // get data from cache
  const data = cachedEvent.get(hash);

  // update by calling all callback
  const callbackList = registeredCallback.get(hash);
  for (const callback of callbackList) {
    // const temp = [...data];
    const temp = Array.from(data);
    callback(temp);
  }
}


// TODO: not yet completed
// function getEvent_Date(date: any) {
// }


export function addEvent(date: any, timeStart: any, timeEnd: any, tagList: any) {
  request_AddEvent(date, timeStart, timeEnd, tagList);
}


export function rmEvent(date: any, index: bigint) {
  request_RmEvent(date, index);
}


export function configEvent(date: any, index: bigint, timeStart: any, timeEnd: any, tagList: any) {
  request_ConfigEvent(date, index, timeStart, timeEnd, tagList);
}
