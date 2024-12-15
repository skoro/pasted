/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/prefer-default-export */
import { ref, toRaw, computed } from 'vue';
import { defineStore } from 'pinia';
import Model from '../../models/clip';
import db from './db';

export const useClipboardStore = defineStore('clips', () => {
  const MAX_BUFFER = 100;
  const modelCollection = ref([]);

  // state

  const filter = ref('');
  const onlyStarred = ref(false);
  const withImages = ref(false);

  const clips = computed(() => modelCollection.value
    .filter((i) => (onlyStarred.value ? i.starred : true))
    .filter((i) => (filter.value ? Model.contains(i, filter.value) : true))
    .filter((i) => (withImages.value ? i.image : true)));

  const images = computed(() => modelCollection.value
    .filter((i) => i.image));
  const starred = computed(() => modelCollection.value
    .filter((i) => i.starred));

  // private

  /**
   * Resets onlyStarred filter if starred collection is empty.
   */
  function updateOnlyStarred() {
    if (onlyStarred.value) {
      onlyStarred.value = starred.value.length > 0;
    }
  }

  /**
   * Resets withImages filter if images collection is empty.
   */
  function updateWithImages() {
    if (withImages.value) {
      withImages.value = images.value.length > 0;
    }
  }

  // actions

  /**
   * @param {number} fromIndex
   */
  function moveToTop(fromIndex) {
    /**
       * @type {import("../../models/clip").Model}
       */
    const model = modelCollection.value.at(fromIndex);

    model.created = Date.now();

    modelCollection.value.splice(fromIndex, 1);
    modelCollection.value.unshift(model);

    db.update(toRaw(model));
  }

  /**
   * @param {string} clipId
   * @returns {import("../../models/clip").Model|null}
   */
  function remove(clipId) {
    for (let i = 0; i < modelCollection.value.length; i++) {
      if (modelCollection.value[i].id === clipId) {
        /** @type {import("../../models/clip").Model} */
        const model = modelCollection.value[i];
        db.remove(model.id);
        modelCollection.value.splice(i, 1);
        updateOnlyStarred();
        updateWithImages();
        return model;
      }
    }
    return null;
  }

  /**
   * @param {import("../../models/clip").Model} model
   */
  function append(model) {
    // only non-starred models
    const models = modelCollection.value.filter((m) => !m.starred);

    // remove bottom models to fit space to new model
    while (models.length >= MAX_BUFFER) {
      const toRemove = models.at(-1);
      remove(toRemove.id);
      models.splice(-1, 1); // must be removed to maintain "length" property
    }

    modelCollection.value.unshift(model);
    db.add(model);
  }

  /**
   * @param {import("../../models/clip").Model} model
   */
  function put(model) {
    /** @type {number} */
    const existIndex = modelCollection.value.findIndex((item) => item.data === model.data);

    if (existIndex >= 0) {
      moveToTop(existIndex);
    } else {
      append(model);
    }
  }

  function clear(callback) {
    clips.value.forEach((i) => callback(i) && remove(i.id));
  }

  /**
   * @param {string} clipId
   */
  function toggleStarred(clipId) {
    for (const clip of modelCollection.value) {
      if (clip.id === clipId) {
        clip.starred = !clip.starred;
        db.update(toRaw(clip));
        updateOnlyStarred();
        break;
      }
    }
  }

  function getModelsFromDb(onAfterLoad) {
    clear();

    /** @type {import("../../models/clip").Model[]} */
    const tmp = [];

    db.getAll(
      /**
       * @param {import("../../models/clip").Model} model
       */
      (model) => tmp.push(model),
      () => {
        modelCollection.value = tmp.toSorted(
        /**
         * @param {import("../../models/clip").Model} a
         * @param {import("../../models/clip").Model} b
         * @returns {number}
         */
          (a, b) => b.created - a.created,
        );
        if (onAfterLoad) onAfterLoad();
      },
    );
  }

  /**
   * @returns {?import("../../models/clip").Model|null}
   */
  function peekTop() {
    if (modelCollection.value.length > 0) {
      return modelCollection.value[0];
    }
    return null;
  }

  /**
   * Gets n top items.
   *
   * @param {number} n=5 How many items from the top to get.
   * @returns {import("../../models/clip").Model[]}
   */
  function top(n = 5) {
    if (modelCollection.value.length === 0) {
      return [];
    }
    // TODO: only text items are needed
    return modelCollection.value.slice(0, n < 0 ? 10 : n).map(toRaw).reverse();
  }

  return {
    // state
    clips,
    images,
    onlyStarred,
    withImages,
    filter,
    starred,
    // actions
    put,
    remove,
    clear,
    toggleStarred,
    getModelsFromDb,
    peekTop,
    top,
  };
});
