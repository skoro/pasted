import { defineStore } from 'pinia';
import { ref } from 'vue';

export const usePreferencesStore = defineStore('prefs', () => {

    // state
    const trimStrings = ref(false)
    const ignoreEmptyStrings = ref(false)
    const startMinimized = ref(false)

    // actions
    function init(data) {
        trimStrings.value = Boolean(data?.trimStrings ?? false)
        ignoreEmptyStrings.value = Boolean(data?.ignoreEmptyStrings ?? false)
        startMinimized.value = Boolean(data?.startMinimized ?? false)
    }

    return {
        trimStrings,
        ignoreEmptyStrings,
        startMinimized,

        init,
    }
});
