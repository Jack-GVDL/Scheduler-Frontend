import axios, { AxiosRequestConfig } from "axios";
import { pad } from "@/utility/Utility"
import {
  ItemManager_setItem,
  ItemManager_addCallback,
  ItemManager_rmCallback
} from "@/utility/ItemManager.ts"


// Local Data
const date_map              = new Map();
const date_list: any[]      = [];
let   serverAddress         = "http://localhost:5000";


// Local Function
// hash
function getHash_Date(date: any) {
  return date[0] * 10000 + date[1] * 100 + date[2];
}


function getString_Date(date: any) {
  return pad(date[0], 4) + pad(date[1], 2) + pad(date[2], 2);
}


// network
function request(config: AxiosRequestConfig) {
  // create instance
  const instance = axios.create({
    baseURL: serverAddress,
    timeout: 5000
  });

  // return instance
  return instance(config);
}


function request_GetDateList() {
  // create request
  const instance = request({
    url: "/GetDateList",
    method: "GET"
  })

  // get data
  instance.then(res => {
    // put on cache
    ItemManager_setItem("DateList", res.data, true);
  })
}


function request_GetEvent_Date(date: any) {
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
    // record this date
    if ( !date_map.has(getHash_Date(date)) ) {
      date_map.set(getHash_Date(date), null);
      date_list.push(date);
    }

    // put on cache
    ItemManager_setItem(getString_Date(date), res.data, true);
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
    // update the date of event
    request_GetEvent_Date(date);
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
    // update the date of event
    request_GetEvent_Date(date);
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
    // update the date of event
    request_GetEvent_Date(date);
  }).catch();
}


// Global Function
export function DataServer_registerCallback_EventList(date: any, callback: any) {
  // add to manager
  ItemManager_addCallback(getString_Date(date), callback);
}


export function DataServer_registerCallback_DateList(callback: any) {
  // add to manager
  ItemManager_addCallback("DateList", callback);
}


export function DataServer_unregisterCallback_EventList(date: any, callback: any) {
  // rm from manager
  ItemManager_rmCallback(getString_Date(date), callback);
}


export function DataServer_unregisterCallback_DateList(callback: any) {
  // rm from manager
  ItemManager_rmCallback("DateList", callback);
}


export function DataServer_update_EventList(date: any) {
  request_GetEvent_Date(date);
}


export function DataServer_update_DateList() {
  request_GetDateList();
}


export function DataServer_updateAll() {
  for (let i = 0; i < date_list.length; i++) {
    request_GetEvent_Date(date_list[i]);
  }
  request_GetDateList();
}


export function DataServer_addEvent(date: any, timeStart: any, timeEnd: any, tagList: any) {
  request_AddEvent(date, timeStart, timeEnd, tagList);
}


export function DataServer_rmEvent(date: any, index: bigint) {
  request_RmEvent(date, index);
}


export function DataServer_configEvent(date: any, index: bigint, timeStart: any, timeEnd: any, tagList: any) {
  request_ConfigEvent(date, index, timeStart, timeEnd, tagList);
}


export function DataServer_getServerAddress() {
  return serverAddress;
}


export function DataServer_setServerAddress(address: string) {
  // check if the same for new and old value
  if (address === serverAddress) return;

  // set address
  serverAddress = address;

  // update all the data from the new address
  DataServer_updateAll();
}
