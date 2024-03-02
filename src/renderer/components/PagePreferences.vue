<script setup>
import HeaderBar from './HeaderBar.vue'
import ToolButton from './ToolButton.vue'
import IconCross from './icons/IconCross.vue'
import KeyboardShortcut from './KeyboardShortcut.vue'
import { usePreferencesStore } from '../stores/usePreferencesStore'
import { keyboard } from '../keyshortcuts'
import Mousetrap from 'mousetrap'
import { onMounted } from 'vue'
import { version } from '../../../package.json'

const emit = defineEmits(['close-page'])

const prefs = usePreferencesStore()

onMounted(() => {
    Mousetrap.bind('esc', closePage)
})

function closePage() {
    emit('close-page')
}
</script>

<template>
    <div class="relative">

        <HeaderBar class="justify-between px-4 text-gray-600">
            <p class="order-first">Preferences</p>
            <ToolButton class="order-last w-8 h-8" @click="closePage">
                <IconCross></IconCross>
            </ToolButton>
        </HeaderBar>

        <div class="my-11 p-4 divide-y divide-neutral-200">
            <div class="flex items-center mb-4">
                <input
                    id="opt-1"
                    type="checkbox"
                    class="w-4 h-4"
                    v-model="prefs.ignoreEmptyStrings"
                />
                <label
                    for="opt-1"
                    class="text-sm ml-3 font-medium text-gray-900"
                >Ignore empty strings</label>
            </div>

            <div class="text-sm text-slate-400 space-y-3 pt-4">
                <KeyboardShortcut label="Copy nth item" keys="alt+1..9"/>
                <KeyboardShortcut label="Preview nth item" keys="alt+shift+1..9"/>
                <KeyboardShortcut label="Search" :keys="keyboard.search"/>
                <KeyboardShortcut label="Show/hide app window" :keys="keyboard.toggleAppFocus"/>
                <KeyboardShortcut label="Starred" :keys="keyboard.toggleStarred"/>
                <KeyboardShortcut label="Images" :keys="keyboard.toggleImages"/>
                <KeyboardShortcut label="Remove items" :keys="keyboard.removeItems"/>
                <KeyboardShortcut label="Open preferences" :keys="keyboard.openPrefs"/>
            </div>

            <div class="text-sm text-slate-400 mt-4 pt-2">
                Version: <span class="font-medium">{{ version }}</span>
            </div>
        </div>
    </div>
</template>
