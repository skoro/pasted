import { defineStore } from "pinia"
import { ref } from "vue"

export const usePreferencesStore = defineStore('prefs', () => {

    // state
    const trimStrings = ref(true)
    const ignoreEmptyStrings = ref(true)

    return {
        trimStrings,
        ignoreEmptyStrings,
    }
})
