import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import Clip from './Clip'

export const useClipboardStore = defineStore('clips', () => {
  const clipsCollection = ref([
    new Clip('test-1', false),
    new Clip('test-2', false),
    new Clip('test-3', false),
    new Clip('fav-1', true),
    new Clip(
      "When you use a CSS property that requires a vendor prefix in :style, Vue will automatically add the appropriate prefix. Vue does this by checking at runtime to see which style properties are supported in the current browser. If the browser doesn't support a particular property then various prefixed variants will be tested to try to find one that is supported.",
      false
    ),
    new Clip(
      `
    Multiple Values
You can provide an array of multiple (prefixed) values to a style property, for example:

template
<div :style="{ display: ['-webkit-box', '-ms-flexbox', 'flex'] }"></div>
This will only render the last value in the array which the browser supports. In this example, it will render display: flex for browsers that support the unprefixed version of flexbox.


    `,
      false
    )
  ])

  const filter = ref('')

  const favorites = computed(() =>
    clipsCollection.value.filter((i) => i.favorite).filter((i) => i.hasMatch(filter.value))
  )
  const clips = computed(() =>
    clipsCollection.value.filter((i) => !i.favorite).filter((i) => i.hasMatch(filter.value))
  )

  function append(clip) {
    clips.value.unshift(clip)
  }

  function remove(clipId) {
    for (var i = 0; i < clipsCollection.value.length; i++) {
      if (clipsCollection.value[i].id === clipId) {
        clipsCollection.value.splice(i, 1)
      }
    }
  }

  function clear() {
    clips.value.forEach((i) => remove(i.id))
  }

  function toggleFavorite(clipId) {
    for (const clip of clipsCollection.value) {
      if (clip.id === clipId) {
        clip.favorite = !clip.favorite
      }
    }
  }

  return { clips, favorites, filter, append, remove, clear, toggleFavorite }
})
