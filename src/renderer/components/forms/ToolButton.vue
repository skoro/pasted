<script setup>
defineProps({
  tooltip: {
    type: String,
  },
});
</script>
<template>
    <button class="hover:text-black group relative">
        <slot></slot>
        <span v-if="tooltip" class="
            absolute
            hidden
            group-hover:flex
            top-9
            right-8
            translate-x-full
            px-2 py-1
            bg-slate-100
            rounded-lg
            text-center
            text-slate-400
            text-sm
        ">{{ tooltip }}</span>
    </button>
</template>
