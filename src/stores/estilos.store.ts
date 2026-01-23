import type { Estilo } from "@/types";
import { defineStore } from "pinia";

interface StateEstilos {
  estilos: Estilo[]
}

interface EstiloId {
  id: number
}

const useEstiloStore = defineStore('estilo', {
  state: (): StateEstilos => ({
    estilos: []
  }),
  getters: {
    valorEstilo: (state) => {
      const estiloSelect = state.estilos.find(es => es.select == true);

      if (estiloSelect) return estiloSelect.valor
      else return 0
    }
  },
  actions: {
    addEstilo(newEstilo: Estilo, estilosSelect?: EstiloId) {
      if (!this.estilos.some(op => op.id == newEstilo.id)) {

        if (estilosSelect) {
          if (estilosSelect.id == newEstilo.id) newEstilo.select = true
        } else newEstilo.select = false

        newEstilo.valor = Number(newEstilo.valor);
        this.estilos.push(newEstilo);
      }
    }
  }
})

export default useEstiloStore;
