import { ref, computed } from "vue";
import { defineStore } from "pinia";
import ClipEntity from "./clip-entity";

export const useClipboardStore = defineStore("clips", () => {
  const MAX_BUFFER = 100;
  const clipEntities = ref([]);
  const filter = ref("");

  // state

  const favorites = computed(() =>
    clipEntities.value
      .filter((i) => i.favorite)
      .filter((i) => i.hasMatch(filter.value))
  );
  const clips = computed(() =>
    clipEntities.value
      .filter((i) => !i.favorite)
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
        clipEntities.value.splice(i, 1);
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

  return { clips, favorites, filter, append, remove, clear, toggleFavorite };
});
