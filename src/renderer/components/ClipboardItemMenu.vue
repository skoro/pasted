<script setup>
import Clip from '../../models/clip';
import ToolButton from './forms/ToolButton.vue';
import IconCopy from './icons/IconCopy.vue';
import IconTrash from './icons/IconTrash.vue';
import IconSearch from './icons/IconSearch.vue';
import IconQR from './icons/IconQR.vue';
import IconDownload from './icons/IconDownload.vue';
import IconCross from './icons/IconCross.vue';

defineEmits([
  'switch-view',
  'copy-item',
  'remove-item',
  'peek-item',
  'qr-item',
  'save-item',
]);

defineProps({
  clip: {
    type: Object,
    required: true,
  },
});
</script>

<template>
    <div class="flex flex-row-reverse w-full space-x-3 text-slate-600">
        <ToolButton class="h-8 w-8 pl-2" @click="$emit('switch-view', 'view')">
            <IconCross />
        </ToolButton>
        <ToolButton class="h-8 w-8" @click="$emit('copy-item')" tooltip="Copy">
            <IconCopy />
        </ToolButton>
        <ToolButton class="h-8 w-8" @click="$emit('peek-item')" tooltip="Peek">
            <IconSearch />
        </ToolButton>
        <ToolButton v-if="Clip.canMakeQR(clip)" class="h-8 w-8" @click="$emit('qr-item')" tooltip="QR code">
            <IconQR />
        </ToolButton>
        <ToolButton class="h-8 w-8" @click="$emit('remove-item')" tooltip="Delete">
            <IconTrash />
        </ToolButton>
        <ToolButton class="h-8 w-8" @click="$emit('save-item')" tooltip="Save">
            <IconDownload />
        </ToolButton>
    </div>
</template>
