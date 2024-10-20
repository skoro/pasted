<script setup>
import {
  toRaw, onMounted, onUnmounted, ref, computed,
} from 'vue';
import HeaderBar from '../HeaderBar.vue';
import ToolButton from '../forms/ToolButton.vue';
import IconCopy from '../icons/IconCopy.vue';
import IconTrash from '../icons/IconTrash.vue';
import IconCross from '../icons/IconCross.vue';
import IconStarOutline from '../icons/IconStarOutline.vue';
import IconStarSolid from '../icons/IconStarSolid.vue';
import IconQR from '../icons/IconQR.vue';
import IconDownload from '../icons/IconDownload.vue';
import { keyboard, bindKey, bindEscKey } from '../../keyshortcuts';
import { useClipboardStore } from '../../stores/useClipboardStore';
import Clip from '../../../models/clip';

const props = defineProps({
  clip: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['open-page', 'close-page']);

const clipboard = useClipboardStore();

const textAreaHeight = ref(0);
const headerBar = ref(null);

const isImage = computed(() => props.clip.image);

function closePage() {
  emit('close-page');
}

function copyClip() {
  window.electronAPI.selectClipModel(toRaw(props.clip));
  closePage();
}

function removeClip() {
  if (confirm('Are you sure you want to remove ?')) {
    clipboard.remove(props.clip.id);
    window.electronAPI.removeClipModel(props.clip.id);
    closePage();
  }
}

function toggleStarred() {
  clipboard.toggleStarred(props.clip.id);
}

/**
 * Calculate text area height.
 */
function recalcHeight() {
  textAreaHeight.value = window.innerHeight - headerBar.value.$el.clientHeight - 16;
}

function saveImage() {
  window.electronAPI.saveImage(props.clip.data);
}

onMounted(() => {
  bindKey(keyboard.toggleStarred, toggleStarred);
  bindKey(keyboard.removeItems, removeClip);
  bindKey(keyboard.copyItem, copyClip);
  bindEscKey(closePage);

  if (!isImage.value) {
    recalcHeight();
    window.addEventListener('resize', recalcHeight);
  }
});

onUnmounted(() => {
  if (!isImage.value) {
    window.removeEventListener('resize', recalcHeight);
  }
});
</script>

<template>
    <div class="relative">

        <HeaderBar ref="headerBar" class="text-gray-600 justify-between px-4">
            <div class="flex space-x-4 items-center">
                <ToolButton class="h-8 w-8" @click="copyClip">
                    <IconCopy></IconCopy>
                </ToolButton>
                <ToolButton class="h-8 w-8" @click="toggleStarred">
                    <IconStarSolid v-if="clip.starred"></IconStarSolid>
                    <IconStarOutline v-else></IconStarOutline>
                </ToolButton>
                <ToolButton v-if="Clip.canMakeQR(clip)" class="h-8 w-8" @click="$emit('open-page', 'QrCodePage', clip)">
                  <IconQR></IconQR>
                </ToolButton>
                <ToolButton class="h-8 w-8" @click="removeClip">
                    <IconTrash></IconTrash>
                </ToolButton>
                <ToolButton class="h-8 w-8" @click="saveImage" v-if="clip.image">
                    <IconDownload></IconDownload>
                </ToolButton>
            </div>
            <ToolButton class="h-8 w-8" @click="closePage">
                <IconCross></IconCross>
            </ToolButton>
        </HeaderBar>

        <div class="mt-11 space-y-2 p-1">
            <img v-if="isImage" :src="clip.data"/>
            <textarea
              class="w-full h-full text-sm font-mono focus:outline-2 focus:outline-slate-300 mousetrap"
              :style="{ height: textAreaHeight + 'px' }"
              disabled
              v-else
            >{{ clip.data }}</textarea>
        </div>
    </div>
</template>

<style>
textarea {
  resize: none;
}
</style>
