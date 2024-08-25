// eslint-disable-next-line import/no-extraneous-dependencies
import Mousetrap from 'mousetrap';

const keyboard = {
  search: 'ctrl+k',
  toggleAppFocus: 'Super+Alt+,',
  toggleStarred: 'ctrl+s',
  toggleImages: 'ctrl+i',
  removeItems: 'ctrl+r',
  openPrefs: 'ctrl+o',
  copyItem: 'space',
  hideWindow: 'ctrl+w',
};

/**
 * @callback callback
 */

/**
 * @param {string} keyName
 * @param {callback} callback
 */
function bindKey(keyName, callback) {
  Mousetrap.bind(keyName, (e) => {
    if (e.preventDefault) {
      e.preventDefault();
    }
    callback();
  });
}

/**
 * @param {string} keyName
 */
function unbindKey(keyName) {
  Mousetrap.unbind(keyName);
}

/**
 * @param {callback} callback
 */
function bindEscKey(callback) {
  Mousetrap.bind('esc', callback);
}

function resetKeys() {
  Mousetrap.reset();
}

export {
  keyboard, bindKey, bindEscKey, unbindKey, resetKeys,
};
