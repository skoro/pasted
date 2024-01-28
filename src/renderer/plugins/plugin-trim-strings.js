import { toRaw } from "vue"
import { usePreferencesStore } from "../stores/usePreferencesStore"
import { useClipboardStore } from "../stores/useClipboardStore"
import Clip from "../../models/clip"

const electron = window.electronAPI

/**
 * @param {import("../../models/clip").Model} model
 *
 * @returns {import("../../models/clip").Model}
 */
function trimStrings(model) {
    const trimmed = Clip.factory(model.data.trim())
    if (Clip.equals(trimmed, model)) {
        return
    }

    model.data = trimmed.data
    model.hash = trimmed.hash

    electron.removeClipModel(model.id)
    electron.selectClipModel(model)
}

/**
 * @param {import("../../models/clip").Model} model
 *
 * @returns {import("../../models/clip").Model}
 */
function ignoreEmptyStrings(model) {
    if (model.data.trim().length === 0) {
        electron.removeClipModel(model.id)

        const clipboardStore = useClipboardStore()
        const top = clipboardStore.peekTop()

        if (top) {
            electron.selectClipModel(toRaw(top))
        }

        throw new Error('ignore empty string')
    }
}

export function pluginTrimStrings({ store }) {
    const prefs = usePreferencesStore()

    store.$onAction(({ name, store, args }) => {
        if (store.$id === 'clips' && name === 'put') {
            /** @type {import("../../models/clip").Model} */
            const model = args[0]

            if (model.image) {
                return
            }

            if (prefs.trimStrings) {
                trimStrings(model)
            }
            
            if (prefs.ignoreEmptyStrings) {
                ignoreEmptyStrings(model)
            }
        }
    })
}
