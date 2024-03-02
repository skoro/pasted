<script setup>
import { computed } from 'vue'

const props = defineProps({
    label: {
        type: String,
        required: true,
    },
    help: {
        type: String,
        required: false,
    }
})

const model = defineModel()

const hasHelp = computed(() => props.help.length > 0)
</script>

<template>
    <div class="flex">
        <div class="flex items-center h-5">
            <input id="opt-1" type="checkbox" class="w-4 h-4" v-model="model" />
        </div>
        <div class="ms-2 text-sm">
            <label for="opt-1" class="text-sm font-medium text-gray-900">{{ label }}</label>
            <p v-if="hasHelp" class="text-xs font-normal text-gray-500">{{ help }}</p>
        </div>
    </div>

</template>
