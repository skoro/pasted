/** @type {IDBDatabase} */
let db

function open(onopen, onerror) {
    /** @type {IDBOpenDBRequest} */
    const request = window.indexedDB.open('pasted_db', 1)

    request.onerror = onerror
    
    request.onupgradeneeded = (event) => {
        /** @type {IDBDatabase} */
        const _db = event.target.result
        const objectStore = _db.createObjectStore('clips', { keyPath: 'id' })
        objectStore.createIndex('id', 'id', { unique: true })
        objectStore.createIndex('hash', 'hash', { unique: false })
    }
    
    request.onsuccess = (event) => {
        /** @type {IDBDatabase} */
        db = event.target.result
        onopen && onopen(event)
    }
}

/**
 * @returns {boolean}
 */
function isOpened() {
    return db !== undefined
}

/**
 * @param {string} [mode=readonly] mode readonly, readwrite, versionchange
 * @returns {IDBObjectStore}
 */
function getClipsObjectStore(mode = 'readonly') {
    return db.transaction('clips', mode).objectStore('clips')
}

/**
 * @param {Object} clip
 * @param {string} clip.id
 * @param {*} onsuccess 
 */
function add(clip, onsuccess) {
    getClipsObjectStore('readwrite').add(clip).onsuccess = onsuccess
}

/**
 * @param {Object} clip 
 * @param {string} clip.id
 * @param {*} onsuccess
 * @param {*} onerror
 */
function get(clip, onsuccess, onerror) {
    const request = getClipsObjectStore().get(clip.id)
    request.onsuccess = onsuccess
    request.onerror = onerror
}

function getAll(onrecord, onnomorecord) {
    const objectStore = getClipsObjectStore()
    objectStore.openCursor().onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
            onrecord && onrecord(cursor.value)
            cursor.continue()
        } else {
            onnomorecord && onnomorecord()
        }
    }
}

function update(clip, onsuccess) {
    const request = getClipsObjectStore('readwrite').put(clip)
    request.onsuccess = onsuccess
}

function remove(id) {
    getClipsObjectStore('readwrite').delete(id)
}

export default { open, isOpened, add, get, getAll, update, remove }
