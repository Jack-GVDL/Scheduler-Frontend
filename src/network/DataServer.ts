import axios, { AxiosRequestConfig } from "axios";
import { pad } from "@/utility/Utility"
import {
  ItemManager_setItem,
  ItemManager_addCallback,
  ItemManager_rmCallback, ItemManager_getIsExist, ItemManager_updateItem
} from "@/utility/ItemManager.ts";


// Local Data
const date_map              = new Map();
const date_list: any[]      = [];
let   serverAddress         = "http://localhost:5000";

let   is_initiated          = false;


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
  });

  // get data
  instance.then(res => {
    ItemManager_setItem("DateList", res.data, true);
    ItemManager_setItem("Server_UpdateStatus", 2);
  }).catch(res => {
    ItemManager_setItem("Server_UpdateStatus", 3);
  });
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
  }).catch();
}


function request_AddDate(date: any) {
  // create request
  const instance = request({
    url: "/AddDate",
    method: "POST",
    params: {
      date: date[0] + '_' + date[1] + '_' + date[2],
    }
  });

  // send request
  instance.then(res => {
    request_GetEvent_Date(date);
  }).catch();
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
  });

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


function request_GetTodoList() {
  // create request
  const instance = request({
    url: "/GetTodoList",
    method: "GET"
  });

  // get data
  instance.then(res => {
    ItemManager_setItem("Server/TodoList/Data", res.data, true);;
    ItemManager_setItem("Server/TodoList/Status", 2);
  }).catch(res => {
    ItemManager_setItem("Server/TodoList/Status", 3);
  });
}


function request_AddTodo(name: string, note: string, is_chain_update: boolean) {
  // create request
  const instance = request({
    url: "/AddTodo",
    method: "POST",
    params: {
      name: name,
      note: note
    }
  });

  // send request
  instance.then(res => {
    if (is_chain_update) request_GetTodoList();
  }).catch();
}


function request_RmTodo(id_: any, is_chain_update: boolean) {
  // create request
  const instance = request({
    url: "/RmTodo",
    method: "POST",
    params: {
      id: id_
    }
  });

  // send request
  instance.then(res => {
    if (is_chain_update) request_GetTodoList();
  }).catch();
}


function request_ConfigTodo(id_: any, name: string, note: string, is_chain_update: boolean) {
  // create request
  const instance = request({
    url: "/ConfigTodo",
    method: "POST",
    params: {
      id:   id_,
      name: name,
      note: note
    }
  });

  // send request
  instance.then(res => {
    if (is_chain_update) request_GetTodoList();
  }).catch();
}


function request_AddSubTask(id_: any, name: string, is_done: boolean, is_chain_update: boolean) {
  // create request
  const instance = request({
    url: "/AddSubTask",
    method: "POST",
    params: {
      id:       id_,
      name:     name,
      is_done:  is_done ? "1" : "0"
    }
  });

  // send request
  instance.then(res => {
    if (is_chain_update) request_GetTodoList();
  }).catch();
}


function request_RmSubTask(id_todo: any, id_subtask: any, is_chain_update: boolean) {
  // create request
  const instance = request({
    url: "/RmSubTask",
    method: "POST",
    params: {
      id_todo:    id_todo,
      id_subtask: id_subtask
    }
  });

  // send request
  instance.then(res => {
    if (is_chain_update) request_GetTodoList();
  }).catch();
}


function request_ConfigSubTask(id_todo: any, id_subtask: any, name: string, is_done: boolean, is_chain_update: boolean) {
  // create request
  const instance = request({
    url: "/ConfigSubTask",
    method: "POST",
    params: {
      id_todo:    id_todo,
      id_subtask: id_subtask,
      name:       name,
      is_done:    is_done ? "1" : "0"
    }
  });

  // send request
  instance.then(res => {
    if (is_chain_update) request_GetTodoList();
  })
}


// Global Function
export function DataServer_init() {
  if (is_initiated) return;

  // Server_UpdateStatus
  // 0: no update
  // 1: updating
  // 2: updated (success)
  // 3: updated (failed)
  ItemManager_setItem("Server_UpdateStatus", 0);
  is_initiated = true;
}


export function DataServer_registerCallback_DateList(callback: any) {
  ItemManager_addCallback("DateList", callback);
}


export function DataServer_registerCallback_EventList(date: any, callback: any, data: any = null) {
  // check if is date already existed
  // if existed, then no need to make request to server
  let is_need_request = false;
  if (!ItemManager_getIsExist(getString_Date(date))) is_need_request = true;

  ItemManager_addCallback(getString_Date(date), callback, true, data);

  // make actual request to server
  if (is_need_request) request_GetEvent_Date(date);
}


export function DataServer_registerCallback_TodoList(callback: any) {
  ItemManager_addCallback("Server/TodoList/Data", callback);
}


export function DataServer_unregisterCallback_EventList(date: any, callback: any) {
  ItemManager_rmCallback(getString_Date(date), callback);
}


export function DataServer_unregisterCallback_DateList(callback: any) {
  ItemManager_rmCallback("DateList", callback);
}


export function DataServer_unregisterCallback_TodoList(callback: any) {
  ItemManager_rmCallback("Server/TodoList/Data", callback);
}


export function DataServer_update_EventList(date: any, is_request_server: boolean = true) {
  if (is_request_server)  request_GetEvent_Date(date);
  else                    ItemManager_updateItem(getString_Date(date));
}


export function DataServer_update_DateList(is_request_server: boolean = true) {
  if (is_request_server)  request_GetDateList();
  else                    ItemManager_updateItem("DateList");
}


export function DataServer_update_TodoList(is_request_server: boolean = true) {
  if (is_request_server)  request_GetTodoList();
  else                    ItemManager_updateItem("Server/TodoList/Data");
}


export function DataServer_updateAll() {
  ItemManager_setItem("Server_UpdateStatus", 1);

  for (let i = 0; i < date_list.length; i++) {
    request_GetEvent_Date(date_list[i]);
  }
  request_GetDateList();
}


export function DataServer_addDate(date: any) {
  request_AddDate(date);
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


export function DataServer_addTodo(
  name: string, is_chain_update: boolean = true) {

  request_AddTodo(name, "", is_chain_update);
}


export function DataServer_rmTodo(
  id_: any, is_chain_update: boolean = true) {

  request_RmTodo(id_, is_chain_update);
}


export function DataServer_configTodo(
  id_: any, name: string, note: string, is_chain_update: boolean = true) {

  request_ConfigTodo(id_, name, note, is_chain_update);
}


export function DataServer_addSubTask(
  id_: any, name: string, is_done: boolean, is_chain_update: boolean = true) {

  request_AddSubTask(id_, name, is_done, is_chain_update);
}


export function DataServer_rmSubTask(
  id_todo: any, id_subtask: any, is_chain_update: boolean = true) {

  request_RmSubTask(id_todo, id_subtask, is_chain_update);
}


export function DataServer_configSubTask(
  id_todo: any, id_subtask: any, name: string, is_done: boolean, is_chain_update: boolean = true) {

  request_ConfigSubTask(id_todo, id_subtask, name, is_done, is_chain_update)
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
