import { ref, toRaw, computed } from "vue";
import { defineStore } from "pinia";
import Model from "../../models/clip";
import db from './db'

export const useClipboardStore = defineStore('clips', () => {
  const MAX_BUFFER = 100;
  const modelCollection = ref([]);

  // state

  const filter = ref('');
  const onlyStarred = ref(false)
  
  const clips = computed(() =>
    modelCollection.value
      .filter((i) => onlyStarred.value ? i.starred : true)
      .filter((i) => filter.value ? Model.contains(i, filter.value) : true)
  )

  // actions

  /**
   * @param {import("../../models/clip").Model} model
   */
  function put(model) {
    /** @type {number} */
    const existIndex = modelCollection.value.findIndex((item) => item.hash === model.hash)

    if (existIndex >= 0) {
      moveToTop(existIndex)
    } else {
      append(model)
    }
  }
  
  /**
   * @param {number} fromIndex
   */
  function moveToTop(fromIndex) {
    /**
     * @type {import("../../models/clip").Model}
     */
    const model = modelCollection.value.at(fromIndex)

    model.created = Date.now()

    modelCollection.value.splice(fromIndex, 1)
    modelCollection.value.unshift(model)

    db.update(toRaw(model))
  }

  /**
   * @param {import("../../models/clip").Model} model
   */
  function append(model) {
    // only non-starred models
    const models = modelCollection.value.filter((model) => !model.starred)

    if (models.length >= MAX_BUFFER) {
      const toRemove = models.at(-1)
      const index = modelCollection.value.findIndex(model => model.id === toRemove.id)
      modelCollection.value.splice(index, 1)
      db.remove(toRemove.id)
    }

    modelCollection.value.unshift(model)
    db.add(model)
  }

  /**
   * @param {string} clipId
   * @returns {import("../../models/clip").Model}
   */
  function remove(clipId) {
    for (var i = 0; i < modelCollection.value.length; i++) {
      if (modelCollection.value[i].id === clipId) {
        /** @type {import("../../models/clip").Model} */
        const model = modelCollection.value[i];
        db.remove(model.id)
        modelCollection.value.splice(i, 1);
        return model;
      }
    }
  }

  function clear() {
    clips.value.forEach((i) => remove(i.id));
  }

  /**
   * @param {string} clipId
   */
  function toggleStarred(clipId) {
    for (const clip of modelCollection.value) {
      if (clip.id === clipId) {
        clip.starred = !clip.starred
        db.update(toRaw(clip))
      }
    }
  }

  function getModelsFromDb() {
    clear()
    
    /** @type {import("../../models/clip").Model[]} */
    const tmp = []

    db.getAll(
      /**
       * @param {import("../../models/clip").Model} model
       */
      (model) => tmp.push(model),
      () => modelCollection.value = tmp.toSorted(
        /**
         * @param {import("../../models/clip").Model} a 
         * @param {import("../../models/clip").Model} b 
         * @returns {number}
         */
        (a, b) => b.created - a.created
      )
    )
  }

  return { clips, onlyStarred, filter, put, remove, clear, toggleStarred, getModelsFromDb }
});
