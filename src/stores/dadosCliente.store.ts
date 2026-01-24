import { defineStore } from 'pinia'
import type { ClienteData } from '@/types'

const useDadosClienteStore = defineStore('dadosCliente', {
  state: (): ClienteData => ({
    nome: '',
    telefone: '',
    dataEntrega: null,
    recebimento: 'entrega',
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    referencia: '',
    pagamento: '',
  }),
  actions: {
    addCliente(newCliente: ClienteData) {
      this.$state = newCliente
    },
  },
  persist: {
    storage: sessionStorage,
  },
})

export default useDadosClienteStore
