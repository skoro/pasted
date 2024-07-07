// eslint-disable-next-line import/no-extraneous-dependencies
import { v4 as uuid } from 'uuid';

/**
 * @typedef {{id: string, data: string, starred: boolean, created: number, image: boolean}} Model
 */

/**
 * Model factory.
 *
 * @param {string} data The clipboard data.
 * @param {boolean} [starred=false]
 * @param {boolean} [isImage=false] The clipboard data should be treated as an image.
 *
 * @returns {Model}
 */
function factory(data, starred = false, isImage = false) {
  return {
    data: String(data),
    starred: Boolean(starred),
    id: uuid(),
    created: Date.now(),
    image: Boolean(isImage),
  };
}

/**
 * The clipboard image model factory.
 *
 * @param {import('electron').NativeImage} nativeImage
 * @param {boolean} [starred=false]
 *
 * @returns {Model}
 */
function image(nativeImage, starred = false) {
  return factory(nativeImage.toDataURL(), starred, true);
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
  return modelA.data === modelB.data;
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
        && model.data.toLowerCase().includes(search.toLowerCase());
}

/**
 * @param {Model} model
 *
 * @returns {boolean}
 */
function canMakeQR(model) {
  return !model.image && model.data.length < 400;
}

/**
 * @param {Model} model
 * @returns {boolean}
 */
function isUrl(model) {
  if (model.image) {
    return false;
  }

  try {
    const url = new URL(model.data);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      throw new Error();
    }
  } catch (_) {
    return false;
  }

  return true;
}

export default {
  factory, image, equals, contains, canMakeQR, isUrl,
};
