import { defineStore } from 'pinia'
import type { Confeitaria } from '@/types'

const useConfeitariaStore = defineStore('confeitaria', {
  state: (): Confeitaria => ({
    id: 0,
    nome: '',
    slug: '',
    cor_princ: '',
    cor_sec: '',
    logo: '',
  }),
  actions: {
    changeConfeitaria(newConf: Confeitaria) {
      this.$state = newConf
    },
  },
  persist: {
    storage: sessionStorage,
  },
})

export default useConfeitariaStore
