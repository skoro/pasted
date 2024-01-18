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
    if (modelCollection.value.length >= MAX_BUFFER) {
      modelCollection.value.pop()
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
    db.getAll(put)
  }

  return { clips, onlyStarred, filter, put, remove, clear, toggleStarred, getModelsFromDb }
});
