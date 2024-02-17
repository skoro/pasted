<script setup>
import HeaderBar from './HeaderBar.vue'
import ToolButton from './ToolButton.vue'
import IconCopy from './icons/IconCopy.vue'
import IconTrash from './icons/IconTrash.vue'
import IconCross from './icons/IconCross.vue'
import IconStarOutline from './icons/IconStarOutline.vue'
import IconStarSolid from './icons/IconStarSolid.vue'
import { useClipboardStore } from '../stores/useClipboardStore'
import { toRaw, onMounted } from 'vue'
import Mousetrap from 'mousetrap'

const props = defineProps({
    clip: {
        type: Object,
        required: true,
    }
})

const emit = defineEmits(['close-page'])

const clipboard = useClipboardStore()

onMounted(() => Mousetrap.bind('esc', closePage))

function copyClip() {
    window.electronAPI.selectClipModel(toRaw(props.clip))
    closePage()
}

function removeClip() {
    if (confirm('Are you sure you want to remove ?')) {
        clipboard.remove(props.clip.id)
        window.electronAPI.removeClipModel(props.clip.id)
        closePage()
    }
}

function closePage() {
    emit('close-page')
}

function toggleStarred() {
    clipboard.toggleStarred(props.clip.id)
}
</script>

<template>
    <div class="relative">

        <HeaderBar class="text-gray-600 justify-between px-4">
            <div class="flex space-x-4 items-center">
                <ToolButton class="h-8 w-8" @click="copyClip">
                    <IconCopy></IconCopy>
                </ToolButton>
                <ToolButton class="h-8 w-8" @click="toggleStarred">
                    <IconStarSolid v-if="clip.starred"></IconStarSolid>
                    <IconStarOutline v-else></IconStarOutline>
                </ToolButton>
                <ToolButton class="h-8 w-8" @click="removeClip">
                    <IconTrash></IconTrash>
                </ToolButton>
            </div>
            <ToolButton class="h-8 w-8" @click="closePage">
                <IconCross></IconCross>
            </ToolButton>
        </HeaderBar>

        <div class="my-11 space-y-2 p-1">
            <img v-if="clip.image" :src="clip.data"/>
            <pre v-else>
                {{ clip.data }}
            </pre>
        </div>
    </div>
</template>
