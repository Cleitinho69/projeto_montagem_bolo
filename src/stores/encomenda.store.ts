import { defineStore } from "pinia";

interface StateEncomenda {
  code: string
  etapas: StateEtapa[]
  estilo: StateEstilo
}

interface StateEstilo {
  id: number,
}

interface StateEtapa {
  id: number,
  opcoes: StateOpcoes[],
}

interface StateOpcoes {
  id: number
}

const useEncomendaStore = defineStore('encomenda', {
  state: (): StateEncomenda => ({
    code:'',
    etapas: [],
    estilo: { id: 0 },
  }),
  actions: {
    saveEtapaOpcao(idEtapa: number, idOpcoes: StateOpcoes[]) {
      const etapa = this.etapas.find(et => et.id === idEtapa);
      if (etapa) {
        etapa.opcoes = idOpcoes
      } else {
        this.etapas.push({ id: idEtapa, opcoes: idOpcoes });
      }
    },
    saveEstilo(id:number){
      this.estilo={id};
    }
  },
  persist: {
    pick: ['etapas'],
    storage: localStorage,
  }
})

export default useEncomendaStore;
