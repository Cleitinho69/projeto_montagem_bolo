import { defineStore } from 'pinia'
import type { Opcao } from '@/types'

interface StateOpcao {
  opcoes: Opcao[]
}

interface OpcaoId {
  id: number
}

const useOpcoesStore = defineStore('opcoes', {
  state: (): StateOpcao => ({
    opcoes: [],
  }),
  getters: {
    valorOpcoes: (state) => {
      const opcoesSelect = state.opcoes.filter((op) => op.select == true)

      let somaValores = 0

      if (opcoesSelect) {
        for (let i = 0; i < opcoesSelect.length; i++) {
          somaValores += opcoesSelect[i]?.valor ?? 0
        }
      }
      return somaValores
    },
  },
  actions: {
    // usei o opcoesSelect aqui por performace, como já tem um filter no watch em etapaDefault resolvi aproveitar ele, mas ainda vou deixar como algo opicional para caso no futuro for necessária essa função em outra parte não precisar mexer aqui de novo
    addOpcao(newOp: Opcao, opcoesSelect?: OpcaoId[]) {
      if (!this.opcoes.some((op) => op.id == newOp.id)) {
        if (opcoesSelect) {
          if (opcoesSelect.some((opSlc) => opSlc.id == newOp.id)) newOp.select = true
        } else newOp.select = false

        newOp.valor = Number(newOp.valor)
        this.opcoes.push(newOp)
      }
    },
  },
  persist: {
    storage: sessionStorage,
  },
})

export default useOpcoesStore