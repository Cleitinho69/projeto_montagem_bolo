import { defineStore } from 'pinia'
import type { Confeitaria } from '@/types'

const useConfeitariaStore = defineStore('confeitaria', {
  state: (): Confeitaria => ({
    id: 0,
    nome: '',
    slug: '',
    cor_princ: '',
    cor_sec: '',
    logo_url: '',
    telefone:'',
  }),
  actions: {
    changeConfeitaria(newConf: Confeitaria) {
      this.$state = newConf
      this.$state.telefone.trim().replace(/\D/g, '')
    },
  },
  persist: {
    storage: sessionStorage,
  },
})

export default useConfeitariaStore
