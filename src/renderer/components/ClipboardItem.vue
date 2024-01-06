<script setup>
import IconTrash from './icons/IconTrash.vue';
import IconFavoriteSolid from './icons/IconFavoriteSolid.vue';
import IconFavoriteOutline from './icons/IconFavoriteOutline.vue';
import ToolButton from './ToolButton.vue';
import Clip from '../stores/clip-entity';
import { useClipboardStore } from '../stores/useClipboardStore';
import { toRaw } from 'vue';

const props = defineProps({
    clip: {
        type: Clip,
        required: true,
    },
    first: {
        type: Boolean,
        default: false,
    },
})

const clipboardStore = useClipboardStore()

function toggleFavorite() {
    clipboardStore.toggleFavorite(props.clip.id)
}

function trash() {
    if (!props.clip.favorite
        || (props.clip.favorite && confirm('Are you sure you want to remove ?')))
    {
        clipboardStore.remove(props.clip.id)
        // FIXME: there should be original object, vue proxied object cannot be cloned by ipc
        window.electronAPI.removeClipEntity(toRaw(props.clip))
    }
}

function select() {
    clipboardStore.moveOnTop(props.clip.id)
    window.electronAPI.selectClipEntity(toRaw(props.clip))
}

</script>

<template>
    <div class="flex p-2 space-x-2 hover:bg-slate-50 items-center max-h-20"
        :class="{ 'bg-slate-200': clip.favorite, 'bg-slate-100': !clip.favorite && !first, 'bg-sky-200': first }">
        <a class="flex-grow text-xs text-left text-slate-500 truncate" href="#" @click="select">
            {{ clip.data }}
        </a>

        <ToolButton class="flex-none w-5 h-5 text-slate-600" @click="toggleFavorite">
            <IconFavoriteSolid v-if="clip.favorite" />
            <IconFavoriteOutline v-else />
        </ToolButton>

        <ToolButton class="flex-none w-5 h-5 text-slate-600" @click="trash">
            <IconTrash />
        </ToolButton>
    </div>
</template>
../stores/clip-model