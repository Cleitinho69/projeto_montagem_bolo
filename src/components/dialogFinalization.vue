<script setup lang="ts">
import { ProgressSpinner } from 'primevue';
import useConfeitariaStore from '@/stores/confeitaria.store';
import WhatsappIcon from './whatsappIcon.vue';
import { criandoEncomenda } from '@/constants';

defineEmits(['enviar_mensagem']);

const confStore = useConfeitariaStore();
</script>

<template>
  <div class="fixed inset-0 bg-black/70 p-md z-101 flex justify-center items-center">
      <div class="bg-white w-full h-153 rounded-2xl inset-0 flex justify-center items-center" v-show="criandoEncomenda">
    <progress-spinner strokeWidth="4" /></div>
    <div class="bg-white w-full rounded-2xl flex flex-col items-center px-md py-xl" v-show="!criandoEncomenda">
      <div
        class=" bg-linear-to-b from-primary/50 to-primary h-27 w-27 rounded-full text-white flex justify-center items-center shadow-lg">
        <i class="pi pi-check" style="font-size: 50px;"></i>
      </div>

      <h2 class="text-2xl font-bold mt-lg">Pedido Confirmado!</h2>
      <p class="text-center text-gray-400 text-sm mt-xs">Seu bolo dos sonhos está sendo preparado com muito carinho!</p>

      <div class="mt-lg flex flex-col justify-center items-center">
        <h3 class="font-bold">Proximos Passos</h3>
        <ul class="flex flex-col gap-3 mt-md">
          <li class="flex gap-2">
            <div class="bg-secondary text-primary w-7 h-7 rounded-full flex justify-center items-center">1</div>
            <div class="text-gray-500 text-sm flex justify-center items-center">Aperte no botão abaixo</div>
          </li>
          <li class="flex gap-2">
            <div class="bg-secondary text-primary w-7 h-7 rounded-full flex justify-center items-center">2</div>
            <div class="text-gray-500 text-sm flex justify-center items-center">Envie a mensagem no whatsapp</div>
          </li>
          <li class="flex gap-2">
            <div class="bg-secondary text-primary w-7 h-7 rounded-full flex justify-center items-center">3</div>
            <div class="text-gray-500 text-sm flex justify-center items-center w-45">Aguarde a respota que deve vir em
              no máximo 12 horas</div>
          </li>
        </ul>
      </div>

      <button
        class="bg-primary py-4 w-full mt-lg rounded-2xl text-white flex justify-center items-center gap-4 text-xl font-semibold" @click="$emit('enviar_mensagem')">Mandar
        mensagem
        <WhatsappIcon class="w-7" />
      </button>

      <span class="text-sm text-gray-400 mt-sm">Obrigado por escolher a {{ confStore.nome }}</span>
    </div>
  </div>
</template>
