import { defineStore } from "pinia"
import { ref } from "vue"

export const usePreferencesStore = defineStore('prefs', () => {

    // state
    const trimStrings = ref(false)
    const ignoreEmptyStrings = ref(false)

    // actions
    function init(data) {
        trimStrings.value = Boolean(data?.trimStrings ?? false)
        ignoreEmptyStrings.value = Boolean(data?.ignoreEmptyStrings ?? false)
    }

    return {
        trimStrings,
        ignoreEmptyStrings,

        init,
    }
})
