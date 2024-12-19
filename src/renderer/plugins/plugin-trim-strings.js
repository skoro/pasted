/* eslint-disable import/no-extraneous-dependencies */
import { toRaw } from 'vue';
import { usePreferencesStore } from '../stores/usePreferencesStore';
import { useClipboardStore } from '../stores/useClipboardStore';
import Clip from '../../models/clip';

/** @type {{electronAPI: import('../../preload/preload').electronAPI}} */
const { electronAPI } = window;

/**
 * @param {import("../../models/clip").Model} model
 */
function trimStrings(model) {
  const trimmed = Clip.factory(model.data.trim());
  if (Clip.equals(trimmed, model)) {
    return;
  }

  // eslint-disable-next-line no-param-reassign
  model.data = trimmed.data;

  electronAPI.removeClipModel(model.id);
  electronAPI.selectClipModel(model);
}

/**
 * @param {import("../../models/clip").Model} model
 *
 * @throws {Error} A string is empty.
 */
function ignoreEmptyStrings(model) {
  if (!model.image && model.data.trim().length === 0) {
    electronAPI.removeClipModel(model.id);

    const clipboardStore = useClipboardStore();
    const top = clipboardStore.peekTop();

    if (top) {
      electronAPI.selectClipModel(toRaw(top));
    }

    throw new Error('plugin info: ignore empty string');
  }
}

export function pluginTrimStrings({ store }) {
  const prefs = usePreferencesStore();

  store.$onAction(({ name, store, args }) => {
    if (store.$id === 'clips' && name === 'put') {
      /** @type {import("../../models/clip").Model} */
      const model = args[0];

      if (model.image) {
        return;
      }

      if (prefs.trimStrings) {
        trimStrings(model);
      }

      if (prefs.ignoreEmptyStrings) {
        ignoreEmptyStrings(model);
      }
    }
  });
}
