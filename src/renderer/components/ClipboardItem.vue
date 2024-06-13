<script setup>
import { ref, shallowRef, toRaw } from 'vue';
import ClipboardItemView from './ClipboardItemView.vue';
import ClipboardItemMenu from './ClipboardItemMenu.vue';
import { useClipboardStore } from '../stores/useClipboardStore';

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

const emit = defineEmits(['peek-item']);

const isCopied = ref(false);
const clipboardStore = useClipboardStore();
const context = shallowRef(ClipboardItemView);

function setViewContext() {
  if (context.value !== ClipboardItemView) {
    context.value = ClipboardItemView;
  }
}

function onSwitchContext(view) {
  switch (view) {
    case 'view':
      setViewContext();
      break;
    case 'menu':
      context.value = ClipboardItemMenu;
      break;
    default:
  }
}

function onCopyItem() {
  isCopied.value = true;
  setTimeout(() => {
    isCopied.value = false;
  }, 800);
  window.electronAPI.selectClipModel(toRaw(props.clip));
  setViewContext();
}

function onToggleStarred() {
  clipboardStore.toggleStarred(props.clip.id);
  setViewContext();
}

function onRemoveItem() {
  if (!props.clip.starred
        || (props.clip.starred && confirm('Are you sure you want to remove ?'))) {
    clipboardStore.remove(props.clip.id);
    // FIXME: there should be original object, vue proxied object cannot be cloned by ipc
    window.electronAPI.removeClipModel(props.clip.id);
  }
}

function onPeekItem() {
  emit('peek-item');
  setViewContext();
}
</script>

<template>
    <div
        class="flex p-2 m-2 h-20 rounded hover:ring-2 hover:ring-gray-200 shadow text-black text-sm font-normal"
        :class="{ 'outline': isCopied, 'outline-sky-300': isCopied }"
    >
        <component
            :is="context"
            :clip="clip"
            :index="index"
            @switch-view="onSwitchContext"
            @toggle-starred="onToggleStarred"
            @copy-item="onCopyItem"
            @remove-item="onRemoveItem"
            @peek-item="onPeekItem"
        >
        </component>
    </div>
</template>
