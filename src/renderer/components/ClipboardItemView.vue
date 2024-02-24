<script setup>
import { computed, onUpdated, onMounted } from 'vue'
import Mousetrap from 'mousetrap'
import ToolButton from './ToolButton.vue'
import IconDotsHorizontal from './icons/IconDotsHorizontal.vue'
import IconStarOutline from './icons/IconStarOutline.vue'
import IconStarSolid from './icons/IconStarSolid.vue'

const emit = defineEmits([
    'switch-view',
    'toggle-starred',
    'copy-item',
    'remove-item',
    'peek-item',
])

const props = defineProps({
    clip: {
        type: Object,
        required: true,
    },
    index: {
        type: Number,
        default: 0,
    },
})

const isShortcutIndex = computed(() => props.index > 0 && props.index < 10)
const lines = computed(() => props.clip.data.substring(0, 199).trimStart().split("\n"))
const isImage = computed(() => props.clip.image)

onMounted(bindShortcut)
onUpdated(bindShortcut)

function copyItem() {
    emit('copy-item')
}

function bindShortcut() {
    Mousetrap.bind(`alt+${props.index}`, copyItem)
}
</script>

<template>
    <div class="flex-1 overflow-hidden">
        <a href="#" @click.prevent="copyItem">
            <img class="object-scale-down h-20" v-if="isImage" :src="clip.data"/>
            <ul v-if="!isImage" v-for="(line, index) in lines" :key="index">
                <li class="text-gray-800">{{ line }}</li>
            </ul>
        </a>
    </div>
    <div v-if="isShortcutIndex" class="flex flex-col w-6 mr-1">
        <p class="bg-slate-100 p-1 rounded-full text-xs text-center text-slate-400">{{ index }}</p>
    </div>
    <div class="flex flex-col text-slate-800 w-6 space-y-4 p-0.5">
        <ToolButton @click="$emit('switch-view', 'menu')">
            <IconDotsHorizontal />
        </ToolButton>
        <ToolButton @click="$emit('toggle-starred')">
            <IconStarSolid v-if="clip.starred" />
            <IconStarOutline v-else />
        </ToolButton>
    </div>
</template>
