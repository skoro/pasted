<script setup>
import { computed, onUpdated, onMounted } from 'vue';
import { bindKey } from '../keyshortcuts';
import Clip from '../../models/clip';
import ToolButton from './forms/ToolButton.vue';
import IconDotsHorizontal from './icons/IconDotsHorizontal.vue';
import IconStarOutline from './icons/IconStarOutline.vue';
import IconStarSolid from './icons/IconStarSolid.vue';

const emit = defineEmits([
  'switch-view',
  'toggle-starred',
  'copy-item',
  'remove-item',
  'peek-item',
  'qr-item',
  'open-url',
]);

const props = defineProps({
  clip: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    default: 0,
  },
});

const isShortcutIndex = computed(() => props.index > 0 && props.index < 10);
const lines = computed(() => props.clip.data.substring(0, 199).trimStart().split('\n'));
const isImage = computed(() => props.clip.image);
const isUrl = computed(() => Clip.isUrl(props.clip));

/**
 * @param {?PointerEvent} event
 */
function copyItem(event) {
  if (event && event.ctrlKey && isUrl.value) {
    emit('open-url');
  } else {
    emit('copy-item');
  }
}

function bindShortcut() {
  bindKey(`${props.index}`, copyItem);
  bindKey(`alt+${props.index}`, () => emit('peek-item', props.clip));
}

onMounted(bindShortcut);
onUpdated(bindShortcut);
</script>

<template>
    <div class="flex-1 overflow-hidden">
        <a href="#" @click.prevent="copyItem" :title="isUrl ? 'Follow link (ctrl + click)' : ''">
            <img class="object-scale-down h-20" v-if="isImage" :src="clip.data"/>
            <ul v-else v-for="(line, index) in lines" :key="index">
                <li class="text-gray-800">{{ line }}</li>
            </ul>
        </a>
    </div>
    <div v-if="isShortcutIndex" class="flex flex-col w-6 mr-1">
        <a href="#"
          @click.prevent="copyItem"
          class="bg-slate-100 p-1 rounded-full text-xs text-center text-slate-400 hover:ring-2 hover:ring-gray-200"
        >{{ index }}</a>
    </div>
    <div class="flex flex-col text-slate-800 w-6 space-y-4 p-0.5">
        <ToolButton class="max-[279px]:w-4 max-[279px]:h-4" @click="$emit('switch-view', 'menu')">
            <IconDotsHorizontal />
        </ToolButton>
        <ToolButton class="max-[279px]:w-4 max-[279px]:h-4" @click="$emit('toggle-starred')">
            <IconStarSolid v-if="clip.starred" />
            <IconStarOutline v-else />
        </ToolButton>
    </div>
</template>
