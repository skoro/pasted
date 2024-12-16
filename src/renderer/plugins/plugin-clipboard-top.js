// This plugin sends 'clipboard:top' ipc event
// after mutating actions on Clipboard store.

/** @type {{electronAPI: import("../../preload/preload").electronAPI}} */
const { electronAPI } = window;
// The list of actions mutate the store.
const mutateActions = ['clear', 'remove', 'moveToTop', 'put'];

export function pluginClipboardTop({ store }) {
  store.$onAction(({ name, store, after }) => {
    if (store.$id === 'clips' && mutateActions.indexOf(name) !== -1) {
      after(() => {
        electronAPI.clipboardTop(store.top());
      });
    }
  });
}
