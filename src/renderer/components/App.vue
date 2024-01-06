<script setup>
  import HeaderActions from './HeaderActions.vue';
  import ClipboardItem from './ClipboardItem.vue';
  import FooterActions from './FooterActions.vue';
  import { useClipboardStore } from '../stores/useClipboardStore';

  const clipboard = useClipboardStore();
</script>

<template>
  <div class="relative">

    <HeaderActions/>

    <div class="divide-y-2 divide-dotted divide-slate-300 mt-14">
      <ClipboardItem v-for="clip in clipboard.favorites" :key="clip.id" :clip="clip">
      </ClipboardItem>
    </div>

    <div class="divide-y-2 divide-dotted divide-slate-200 mb-10">
      <ClipboardItem v-for="(clip, index) in clipboard.clips" :key="clip.id" :clip="clip" :first="index==0">
      </ClipboardItem>
    </div>

    <FooterActions/>

  </div>
</template>
