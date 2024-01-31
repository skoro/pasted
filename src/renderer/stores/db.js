/** @type {IDBDatabase} */
let db

function open(onopen, onerror) {
    /** @type {IDBOpenDBRequest} */
    const request = window.indexedDB.open('pasted_db', 1)

    request.onerror = onerror
    
    /**
     * @param {Event} event
     */
    request.onupgradeneeded = (event) => {
        /** @type {IDBDatabase} */
        const _db = event.target.result
        const objectStore = _db.createObjectStore('clips', { keyPath: 'id' })
        objectStore.createIndex('id', 'id', { unique: true })
    }
    
    /**
     * @param {Event} event 
     */
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
 * @private
 * @param {string} [mode=readonly] mode readonly, readwrite, versionchange
 * @returns {IDBObjectStore}
 */
function getClipsObjectStore(mode = 'readonly') {
    return db.transaction('clips', mode).objectStore('clips')
}

/**
 * @callback onsuccess
 * @param {Event} event
 */

/**
 * @callback onerror
 * @param {Event} event
 */

/**
 * @param {Object} clip
 * @param {string} clip.id
 * @param {onsuccess} onsuccess
 */
function add(clip, onsuccess) {
    getClipsObjectStore('readwrite').add(clip).onsuccess = onsuccess
}

/**
 * @callback onrecord
 * @param {Object} value
 */

/**
 * @param {Object} clip 
 * @param {string} clip.id
 * @param {onrecord} onrecord
 * @param {onerror} onerror
 */
function get(clip, onrecord, onerror) {
    const request = getClipsObjectStore().get(clip.id)

    onrecord && (request.onsuccess = () => onrecord(request.result))
    request.onerror = onerror
}

/**
 * @callback onnomorecord
 * 
 * @param {onrecord} onrecord 
 * @param {onnomorecord} onnomorecord 
 */
function getAll(onrecord, onnomorecord) {
    const cursor = getClipsObjectStore().openCursor()

    /**
     * @param {Event} event 
     */
    cursor.onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
            onrecord && onrecord(cursor.value)
            cursor.continue()
        } else {
            onnomorecord && onnomorecord()
        }
    }
}

/**
 * @param {Object} clip
 * @param {onsuccess} onsuccess 
 */
function update(clip, onsuccess) {
    const request = getClipsObjectStore('readwrite').put(clip)
    request.onsuccess = onsuccess
}

/**
 * @param {string} id
 */
function remove(id) {
    getClipsObjectStore('readwrite').delete(id)
}

export default { open, isOpened, add, get, getAll, update, remove }
