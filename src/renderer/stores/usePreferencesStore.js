import { defineStore } from "pinia"
import { ref } from "vue"

export const usePreferencesStore = defineStore('prefs', () => {

    // state
    const trimStrings = ref(false)
    const ignoreEmptyStrings = ref(false)

    return {
        trimStrings,
        ignoreEmptyStrings,
    }
})
