<script setup lang="ts">
import { faseAtual } from '@/constants';
import router from '@/router';
import { IndexService } from '@/services';
import { url } from '@/services/api';
import useConfeitariaStore from '@/stores/confeitaria.store';
import useEncomendaStore from '@/stores/encomenda.store';
import useEstiloStore from '@/stores/estilos.store';
import useEtapasStore from '@/stores/etapas.store';
import type { Estilo } from '@/types';
import { Button } from 'primevue';
import { onMounted } from 'vue'


const estilosStore = useEstiloStore();
const confeitariaStore = useConfeitariaStore();
const etapasStore = useEtapasStore();
const encomendaStore = useEncomendaStore();

onMounted(async () => {
  const { estilos } = await IndexService.getEstilos(confeitariaStore.slug);
  estilos.forEach(es => estilosStore.addEstilo(es));
})

const selectEstilo = (estilo: Estilo) => {

  const estiloAnterior = estilosStore.estilos.find(es => es.select == true);

  if (estiloAnterior) estiloAnterior.select = false;

  estilo.select = true;

  encomendaStore.saveEstilo(estilo.id)
}

const finalizarEscolhas = () => {
  router.push({ name: 'Finalizar' }).then(() => {
    faseAtual.value++
  })
}

const voltar = () => {
  router.push({ name: 'Etapas', params: { confeitaria: confeitariaStore.slug, ordem: etapasStore.etapas.length } }).then(() => {
    faseAtual.value--
  })
}
</script>

<template>
  <main class="p-md">
    <h2 class="text-2xl font-bold">Escolha um estilo:</h2>
    <span class="text-sm/15 text-gray-600">{{ estilosStore.estilos.length }} estilos especiais para tornar o seu bolo
      especial</span>
    <ul class="flex flex-wrap gap-3 mt-md pb-24">
      <li v-for="estilo in estilosStore.estilos" :key="estilo.id"
        class="card relative w-40 h-60 overflow-hidden rounded-2xl" :class="estilo.select ? 'border-4 border-primary' : ''"
        @click="selectEstilo(estilo)">
        <img class="w-full h-full object-cover contrast-80 brightness-80" :src="url + estilo.imagem" alt="" />
        <div class="absolute inset-0 text-white flex flex-col justify-end p-2">
          <div class="absolute top-2 right-2 px-2 text-md font-semibold rounded-2xl bg-primary" v-if="estilo.select">
            <i class="pi pi-check" style="font-size: 10px"></i> Selecionado
          </div>
          <h4 class="text-md font-bold">{{ estilo.titulo }}</h4>
          <p class="text-caption line-clamp-3">
            {{ estilo.descricao }}
          </p>
          <div class="text-sm font-semibold px-md py-2 rounded-2xl w-fit mt-2"
            :class="estilo.select ? 'bg-primary text-white' : 'bg-white text-black'">{{
              estilo.valor > 0 ? '+R$ '+estilo.valor.toFixed(2).replace('.', ',') : 'Grátis' }}
          </div>
        </div>
      </li>
    </ul>
    <div
      class="bg-white flex justify-center gap-3 fixed left-0 bottom-0 w-full p-md h-24 shadow-[0px_-1px_4px_0px_rgba(0,0,0,0.1)]">
      <Button label="Voltar" icon="pi pi-angle-left"
        class="w-50 !bg-secondary !border-2 !border-pink-100 !text-gray-500 hover:!border-primary hover:!text-primary"
        severity="secondary" @click="voltar" />
      <Button label="Finalizar Escolhas" icon="pi pi-angle-right" icon-pos="right"
        class="grow w-full max-w-75 !bg-primary" raised @click="finalizarEscolhas" />
    </div>
  </main>
</template>

<style scoped>
.p-button {
  appearance: none;
  border: none;
  border-radius: 15px;
}
</style>
