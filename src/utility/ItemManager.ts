// Local Data
let path_background_image = "";
const item_callback = new Map();
const item_cache    = new Map();
const item_flag     = new Map();
const delay_update: string[]  = [];

let is_updating = false;


// Local Function
// hash
// currently the hash is just the string itself
function _getHash_(name: string) {
  return name;
}


function _addItem_(item_name: string) {
  // compute item_name hash
  const hash = _getHash_(item_name);

  // check if the item_name exist or not
  if (item_cache.has(hash)) return false;

  // actual add
  item_cache.set(hash, null);
  item_callback.set(hash, []);
  item_flag.set(hash, 0);
  return true;
}


function _rmItem_(item_name: string) {
  // compute item_name hash
  const hash = _getHash_(item_name);

  // check if the item_name exist or not
  // then check if able to modify the item or not
  if (!item_cache.has(hash))    return false;
  if (item_flag.get(hash) == 1) return false;

  // actual rm
  item_cache.delete(hash);
  item_callback.delete(hash);
  item_flag.delete(hash);
  return true;
}


function _setItem_(item_name: string, value: any, is_create: boolean = false, is_invoke: boolean = true) {
  // compute item_name hash
  const hash = _getHash_(item_name);

  // check if the item_name exist or not
  // then check if able to modify the item or not
  if (!item_cache.has(hash)) {
    if (!is_create) return false;
    _addItem_(item_name);
  }
  if (item_flag.get(hash) == 1) return false;

  // set item
  item_cache.set(hash, value)

  // callback
  if (is_invoke) _update_(null, hash, true);
  return true;
}


function _getItem_(item_name: string, default_none: any = null) {
  // compute item_name hash
  const hash = _getHash_(item_name);

  // check if the item_name exist or not
  // if not exist, return default none
  // else, return the value
  if (!item_cache.has(hash)) return default_none;
  return item_cache.get(hash);
}


function _addCallback_(item_name: any, callback: any, is_create: boolean = true, is_invoke: boolean = true) {
  // compute item_name hash
  const hash = _getHash_(item_name);

  // check if the item_name exist or not
  if (!item_cache.has(hash)) {
    if (!is_create) return false;
    _addItem_(item_name);
  }

  // add to callback
  item_callback.get(hash).push(callback);

  // check if need to update
  if (!is_invoke) return false;

  // update this callback only
  // remember to lock the item before calling the callback and unlock it after done
  const cache = item_cache.get(hash);
  item_flag.set(hash, 1);
  callback(cache);
  item_flag.set(hash, 0);

  return true;
}


function _rmCallback_(item_name: any, callback: any) {
  // compute item_name hash
  const hash = _getHash_(item_name);

  // check if the item_name exist or not
  if (!item_cache.has(hash)) return false;

  // actual removal
  const callback_list = item_callback.get(hash);
  const index = callback_list.indexOf(callback);
  if (index < 0) return false;

  callback_list.splice(index, 1);
  return true;
}


function _updateDelayed_() {
  while (delay_update.length != 0) {
    const item_name = delay_update[0];
    delay_update.splice(0, 1);
    _update_(item_name);
  }
}


function _update_(item_name: any, hash: any = null, is_checked: boolean = false) {
  // compute item_name hash
  if (hash == null) hash = _getHash_(item_name);

  // check if the item_name exist or not
  // then check if the item already in update process or not
  if (!is_checked && !item_cache.has(hash)) return false;
  if (item_flag.get(hash) == 1)             return false;

  // global update lock
  if (is_updating) {
    delay_update.push(hash);
    return;
  }
  is_updating = true;

  // get item
  const item = item_cache.get(hash);

  // lock the item
  item_flag.set(hash, 1);

  // must: key exist in item_callback if exist in item_cache
  // foreach callback
  const callback_list = item_callback.get(hash);
  for (const callback of callback_list) {
    callback(item);
  }

  // unlock the item
  item_flag.set(hash, 0);

  // unlock global update flag and update pending update
  is_updating = false;
  _updateDelayed_();

  return true;
}


// backup
// function _updateSingleCallback_(item_name: any, hash: any = null, is_checked: boolean = false) {
//
// }


function _getKeyList_() {
  return Array.from(item_cache.keys());
}


// Global Function
export function ItemManager_addCallback(item_name: string, callback: any, is_invoke: boolean = true) {
  return _addCallback_(item_name, callback, true);
}


export function ItemManager_rmCallback(item_name: string, callback: any) {
  return _rmCallback_(item_name, callback);
}


export function ItemManager_setItem(item_name: string, value: any, is_invoke: boolean = true) {
  return _setItem_(item_name, value, true, is_invoke);
}


export function ItemManager_updateItem(item_name: string) {
  return _update_(item_name);
}


export function ItemManager_getItem(item_name: string, default_none: any = null) {
  return _getItem_(item_name, default_none);
}


export function ItemManager_getKeyList() {
  return _getKeyList_();
}
