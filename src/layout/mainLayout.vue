<script setup lang="ts">
import { ProgressBar, Avatar } from 'primevue'
import useConfeitariaStore from '@/stores/confeitaria.store'
import useEtapasStore from '@/stores/etapas.store';
import { computed } from 'vue';
import { faseAtual } from '@/constants';

const confStore = useConfeitariaStore();
const etapasStore = useEtapasStore();

const progress = computed(()=>{
  return (faseAtual.value*100)/(etapasStore.etapas.length+5);
})
</script>

<template>
  <header class="bg-primary h-25 rounded-b-[35px] flex justify-center items-center">
    <div class="flex gap-2">
      <Avatar
        :image="confStore.logo_url"
        class="!w-13 !h-13"
        shape="circle"
      />
      <!-- <Avatar :image="confStore.logo" size="large" shape="circle"/> -->
      <div class="flex flex-col justify-center text-white">
        <h1 class="text-xl font-bold">{{ confStore.nome }}</h1>
        <span class="text-xs">Monte seu bolo dos sonhos</span>
      </div>
    </div>
  </header>
  <div class="px-md py-sm">
    <ProgressBar
      :pt="{
        root: { class: '!h-2' },
        value: { class: '!bg-primary' },
      }"
      :value="progress"
      :show-value="false"
    ></ProgressBar>
  </div>

  <router-view/>
</template>

<style scoped>
:root {
  --p-progressbar-value-background: black;
}
</style>
