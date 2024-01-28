import hash from 'hash.js'
import { v4 as uuid } from 'uuid'

/**
 * @typedef {{id: string, data: string, starred: boolean, hash: string, created: number, image: boolean}} Model
 */

/**
 * Model factory.
 *
 * @param {string} data The clipboard data.
 * @param {boolean} [starred=false]
 * @param {boolean} [image=false] The clipboard data should be treated as an image.
 *
 * @returns {Model}
 */
function factory(data, starred = false, image = false) {
    return {
        data: String(data),
        starred: Boolean(starred),
        id: uuid(),
        hash: createCheckSum(data),
        created: Date.now(),
        image: Boolean(image),
    }
}

/**
 * The clipboard image model factory.
 *
 * @param {import('electron').NativeImage} image
 * @param {boolean} [starred=false]
 *
 * @returns {Model}
 */
function image(image, starred = false) {
    return factory(image.toDataURL(), starred, true)
}

/**
 * @param {string} data 
 * @returns {string}
 */
function createCheckSum(data) {
    return hash.sha256().update(data).digest('hex')
}

/**
 * Has the models the same data.
 *
 * @param {Model} modelA
 * @param {Model} modelB
 *
 * @returns {boolean}
 */
function equals(modelA, modelB) {
    return modelA.hash === modelB.hash
}

/**
 * Search the model's data.
 *
 * @param {Model} model The model must be contain only text data.
 * @param {string} search
 *
 * @returns {boolean}
 */
function contains(model, search) {
    return !model.image
        && model.data.toLowerCase().includes(search.toLowerCase())
}

export default { factory, image, equals, contains }
