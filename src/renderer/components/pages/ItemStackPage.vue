<script setup>
import HeaderActions from '../HeaderActions.vue';
import ClipboardItem from '../ClipboardItem.vue';
import FooterActions from '../FooterActions.vue';
import { useClipboardStore } from '../../stores/useClipboardStore';

const clipboard = useClipboardStore();
</script>
<template>
    <div class="relative">

    <HeaderActions/>

    <div class="my-11 space-y-2 p-1 md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <ClipboardItem
            v-for="(clip, index) in clipboard.clips"
            :key="clip.id"
            :clip="clip"
            :index="index + 1"
            @peek-item="$emit('open-page', 'ItemViewerPage', clip)"
            @qr-item="$emit('open-page', 'QrCodePage', clip)"
        >
        </ClipboardItem>
    </div>

    <FooterActions
        @open-prefs="$emit('open-page', 'PreferencesPage')"
    >
    </FooterActions>

    </div>
</template>
