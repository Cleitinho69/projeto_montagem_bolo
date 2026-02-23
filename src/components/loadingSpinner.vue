<script setup lang="ts">
import useConfeitariaStore from '@/stores/confeitaria.store';
import ProgressSpinner from 'primevue/progressspinner';
import { ref, watch } from 'vue';

interface Props {
  loading: boolean;
}

const confStore = useConfeitariaStore();

const props = defineProps<Props>();
const loading = ref(props.loading );


watch(props, (newState) => {
  loading.value = newState.loading;
});

</script>

<template>
  <Transition name="fade">
    <div 
      v-if="loading" 
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-white/50 backdrop-blur-sm"
    >
      <div class="flex flex-col items-center gap-4">
        <ProgressSpinner 
          style="width: 50px; height: 50px" 
          strokeWidth="4" 
          animationDuration=".5s" 
          aria-label="Checando a data..." 
        />
        <span class="font-medium text-sm" :style="{ color: confStore.cor_princ }">Checando a data...</span>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>