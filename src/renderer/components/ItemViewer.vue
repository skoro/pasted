<script setup>
import HeaderBar from './HeaderBar.vue'
import ToolButton from './ToolButton.vue'
import IconCopy from './icons/IconCopy.vue'
import IconTrash from './icons/IconTrash.vue'
import IconCross from './icons/IconCross.vue'
import { computed } from 'vue'

const props = defineProps({
    clip: {
        type: Object,
        required: true,
    }
})

const lines = computed(() => props.clip.data.split("\n"))
</script>

<template>
    <div class="relative">

        <HeaderBar class="text-gray-600 justify-between px-4">
            <div class="flex space-x-4 items-center">
                <ToolButton class="h-8 w-8">
                    <IconCopy></IconCopy>
                </ToolButton>
                <ToolButton class="h-8 w-8">
                    <IconTrash></IconTrash>
                </ToolButton>
            </div>
            <ToolButton class="h-8 w-8" @click="$emit('close-page')">
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
