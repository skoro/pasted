<script setup>
import { onMounted, onUnmounted } from 'vue';
import HeaderBar from '../HeaderBar.vue';
import IconCross from '../icons/IconCross.vue';
import KeyboardShortcut from '../KeyboardShortcut.vue';
import ToolButton from '../forms/ToolButton.vue';
import CheckboxElem from '../forms/CheckboxElement.vue';
import { usePreferencesStore } from '../../stores/usePreferencesStore';
import { keyboard, bindEscKey } from '../../keyshortcuts';
import { version as appVersion } from '../../../../package.json';

const emit = defineEmits(['close-page']);

const prefs = usePreferencesStore();

function closePage() {
  emit('close-page');
}

onMounted(() => {
  bindEscKey(closePage);
});

onUnmounted(() => {
  window.electronAPI.changeStartAtLogin(prefs.startAtLogin);
});
</script>

<template>
    <div class="relative">

        <HeaderBar class="justify-between px-4 text-gray-600">
            <p class="order-first">Preferences</p>
            <ToolButton class="order-last w-8 h-8" @click="closePage">
                <IconCross></IconCross>
            </ToolButton>
        </HeaderBar>

        <div class="my-11 px-4 divide-y divide-neutral-200">

            <CheckboxElem
                class="py-2"
                v-model="prefs.ignoreEmptyStrings"
                label="Ignore empty strings"
                help="A string with whitespaces only won't be put to clipboard."
            ></CheckboxElem>

            <CheckboxElem
                class="py-2"
                v-model="prefs.startMinimized"
                label="Start minimized"
                help="Application will start minimized into the system tray."
            ></CheckboxElem>

            <CheckboxElem
                class="py-2"
                v-model="prefs.startAtLogin"
                label="Start at login"
                help="Application will start after user login."
            ></CheckboxElem>

            <div class="text-sm text-slate-400 space-y-3 pt-4">
                <KeyboardShortcut label="Copy nth item" keys="1..9"/>
                <KeyboardShortcut label="Peek nth item" keys="alt+1..9"/>
                <KeyboardShortcut label="Search" :keys="keyboard.search"/>
                <KeyboardShortcut label="Show/hide app window" :keys="keyboard.toggleAppFocus"/>
                <KeyboardShortcut label="Toggle starred" :keys="keyboard.toggleStarred"/>
                <KeyboardShortcut label="Toggle images" :keys="keyboard.toggleImages"/>
                <KeyboardShortcut label="Remove items" :keys="keyboard.removeItems"/>
                <KeyboardShortcut label="Open preferences" :keys="keyboard.openPrefs"/>
                <KeyboardShortcut label="Copy and close peeking item" :keys="keyboard.copyItem"/>
            </div>

            <div class="text-sm text-slate-400 mt-4 pt-2">
                Version: <span class="font-medium">{{ appVersion }}</span>
            </div>
        </div>
    </div>
</template>
