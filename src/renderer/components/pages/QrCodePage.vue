<script setup>
import { onMounted, ref } from 'vue';
import { QRCodeSVG } from '@akamfoad/qrcode';
import { bindEscKey } from '../../keyshortcuts';

const props = defineProps({
  clip: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close-page']);

const qrcode = new QRCodeSVG(props.clip.data);
const svg = ref(qrcode.toString());

function closePage() {
  emit('close-page');
}

onMounted(() => bindEscKey(closePage));
</script>

<template>
    <div>
        <a href="#" title="Esc or click to close" @click.prevent="$emit('close-page')">
            <span v-html="svg"></span>
        </a>
    </div>
</template>
