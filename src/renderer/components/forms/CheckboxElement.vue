<script setup>
import { computed } from 'vue';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  help: {
    type: String,
    required: false,
  },
});

const model = defineModel();
const elemId = 'pref-' + window.crypto.randomUUID();

const hasHelp = computed(() => props.help && props.help.length > 0);
</script>

<template>
    <div class="flex">
        <div class="flex items-center h-5">
            <input :id="elemId" type="checkbox" class="w-4 h-4" v-model="model" />
        </div>
        <div class="ms-2 text-sm">
            <label :for="elemId" class="text-sm font-medium text-gray-900">{{ label }}</label>
            <p v-if="hasHelp" class="text-xs font-normal text-gray-500">{{ help }}</p>
        </div>
    </div>

</template>
