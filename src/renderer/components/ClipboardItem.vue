<script setup>
import ClipboardItemView from './ClipboardItemView.vue';
import ClipboardItemMenu from './ClipboardItemMenu.vue';
import { useClipboardStore } from '../stores/useClipboardStore';
import { shallowRef, toRaw } from 'vue';

const props = defineProps({
    clip: {
        type: Object,
        required: true,
    }
})

const clipboardStore = useClipboardStore()

const context = shallowRef(ClipboardItemView)

function setViewContext() {
    if (context.value !== ClipboardItemView) {
        context.value = ClipboardItemView
    }
}

function onSwitchContext(view) {
    switch (view) {
        case 'view':
            setViewContext()
            break;
        case 'menu':
            context.value = ClipboardItemMenu
            break;
    }
}

function onCopyItem() {
    window.electronAPI.selectClipModel(toRaw(props.clip))
    setViewContext()
}

function onToggleStarred() {
    clipboardStore.toggleStarred(props.clip.id)
    setViewContext()
}

function onRemoveItem() {
    if (!props.clip.starred
        || (props.clip.starred && confirm('Are you sure you want to remove ?')))
    {
        clipboardStore.remove(props.clip.id)
        // FIXME: there should be original object, vue proxied object cannot be cloned by ipc
        window.electronAPI.removeClipModel(props.clip.id)
    }
}
</script>

<template>
    <div class="flex p-2 m-2 h-20 rounded hover:ring-2 hover:ring-gray-200 shadow text-black text-sm font-normal">
        <component
            :is="context"
            :clip="clip"
            @switch-view="onSwitchContext"
            @toggle-starred="onToggleStarred"
            @copy-item="onCopyItem"
            @remove-item="onRemoveItem"
        >
        </component>
    </div>
</template>
