import { ref, computed } from "vue";
import { defineStore } from "pinia";
import ClipEntity from "./clip-entity";

export const useClipboardStore = defineStore("clips", () => {
  const MAX_BUFFER = 100;
  const clipEntities = ref([]);
  const filter = ref("");

  // state

  const favorites = ref(false)
  
  const clips = computed(() =>
    clipEntities.value
      .filter((i) => favorites.value ? i.favorite : true)
      .filter((i) => i.hasMatch(filter.value))
  );

  // actions

  function append(data) {
    if (clipEntities.value.length >= MAX_BUFFER) {
      clipEntities.value.pop();
    }
    clipEntities.value.unshift(new ClipEntity(data.data));
  }

  function remove(clipId) {
    for (var i = 0; i < clipEntities.value.length; i++) {
      if (clipEntities.value[i].id === clipId) {
        const clipEntity = clipEntities.value[i];
        clipEntities.value.splice(i, 1);
        return clipEntity;
      }
    }
  }

  function clear() {
    clips.value.forEach((i) => remove(i.id));
  }

  function toggleFavorite(clipId) {
    for (const clip of clipEntities.value) {
      if (clip.id === clipId) {
        clip.favorite = !clip.favorite;
      }
    }
  }

  function moveOnTop(clipId) {
    const clipEntity = remove(clipId);
    if (clipEntity) {
      clipEntities.value.unshift(clipEntity);
    }
  }

  return { clips, favorites, filter, append, remove, clear, toggleFavorite, moveOnTop };
});
