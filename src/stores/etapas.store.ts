import { defineStore } from 'pinia'
import type { Etapa } from '@/types';

interface EtapaState {
  etapas: Etapa[]
}

const useEtapasStore = defineStore('etapas', {
  state: (): EtapaState => ({
    etapas: [],
  }),
  actions: {
    addEtapas(newEtapa: Etapa) {
      if(!this.$state.etapas.some(e=>e.id==newEtapa.id)){
        this.$state.etapas.push(newEtapa);
      }
    }
  },
  persist:{
    storage:sessionStorage
  }
})

export default useEtapasStore;
