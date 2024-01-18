import hash from 'hash.js'
import { v4 as uuid } from 'uuid'

/**
 * @typedef {{id: string, data: string, starred: boolean, hash: string}} Model
 */

/**
 * @param {string} data 
 * @param {boolean} starred 
 * @returns {Model}
 */
function factory(data, starred = false) {
    return {
        data: String(data),
        starred: Boolean(starred),
        id: uuid(),
        hash: createCheckSum(data)
    }
}

/**
 * @param {string} data 
 * @returns {string}
 */
function createCheckSum(data) {
    return hash.sha256().update(data).digest('hex')
}

/**
 * @param {Model} modelA
 * @param {Model} modelB
 * @returns {boolean}
 */
function equals(modelA, modelB) {
    return modelA.hash === modelB.hash
}

/**
 * @param {Model} model
 * @param {string} search
 * @returns {boolean}
 */
function contains(model, search) {
    return model.data.toLowerCase().includes(search.toLowerCase())
}

export default { factory, equals, contains }
