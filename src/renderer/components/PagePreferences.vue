<script setup>
import HeaderBar from './HeaderBar.vue'
import ToolButton from './ToolButton.vue'
import IconCross from './icons/IconCross.vue'
import { usePreferencesStore } from '../stores/usePreferencesStore'
import Mousetrap from 'mousetrap'
import { onMounted } from 'vue'

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

        <HeaderBar class="justify-end px-4 text-gray-600">
            <ToolButton class="w-8 h-8" @click="closePage">
                <IconCross></IconCross>
            </ToolButton>
        </HeaderBar>

        <div class="my-11 p-4">
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
                >Ignore empty string</label>
            </div>
        </div>
    </div>
</template>
