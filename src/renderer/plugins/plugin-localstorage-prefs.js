import { usePreferencesStore } from "../stores/usePreferencesStore"

export function pluginLocalStoragePrefs({ store }) {
    if (store.$id === 'prefs') {
        store.$subscribe((mutation, state) => {
            localStorage.setItem(store.$id, JSON.stringify(state))
        })
    }
}

/**
 * @typedef {object} Preferences
 * @property {?boolean} trimStrings
 * @property {?boolean} ignoreEmptyStrings
 * @property {?boolean} startMinimized
 */

/**
 * @returns {Preferences}
 */
export function loadPrefs() {
    const prefs = usePreferencesStore();

    const data = JSON.parse(localStorage.getItem(prefs.$id))
    if (data !== null) {
        prefs.init(data)
    }

    return data;
}
