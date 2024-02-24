<script setup>
import HeaderBar from './HeaderBar.vue'
import ToolButton from './ToolButton.vue'
import IconCross from './icons/IconCross.vue'
import Mousetrap from 'mousetrap'
import { onMounted } from 'vue'

const emit = defineEmits(['close-page'])

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
    </div>
</template>
