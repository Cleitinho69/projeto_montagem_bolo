<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { IndexService } from './services'
import useConfeitariaStore from './stores/confeitaria.store'
import useEtapasStore from './stores/etapas.store'
import useEncomendaStore from './stores/encomenda.store'
import { faseAtual } from './constants'
import useOpcoesStore from './stores/opcoes.store'
import { ProgressSpinner } from 'primevue'
import { updatePreset } from '@primeuix/themes'

const route = useRoute()
const router = useRouter()
const confStore = useConfeitariaStore()
const etapasStore = useEtapasStore()
const encomendaStore = useEncomendaStore()
const opcoesStore = useOpcoesStore()

const isEntrando = ref(true)

const indexService = IndexService

const setColor = (primary: string, secondary: string) => {
  updatePreset({
    semantic: {
      primary: {
        500: primary,
      },
    },
  })

  document.documentElement.style.setProperty('--color-primary', primary)
  document.documentElement.style.setProperty('--color-secondary', secondary)
}

onMounted(async () => {
  await router.isReady()

  const slug = route.params.confeitaria?.toString()

  if (!slug)
    return router.push('/404').finally(() => {
      isEntrando.value = false
    })

  if (slug == '404') return

  if (slug === confStore.slug) return backPage()
  else resetAll()

  try {
    const data = await indexService.getInitialData(slug)
    confStore.changeConfeitaria(data.confeitaria)
    data.etapas.forEach((et) => etapasStore.addEtapas(et))
    setColor(confStore.cor_princ, confStore.cor_sec)
    document.title = confStore.nome
  } catch {
    router.push('/404')
    throw new Error('Essa confeitaria não existe')
  } finally {
    isEntrando.value = false
  }
})

const backPage = () => {
  if (faseAtual.value == 0) {
    router.push({
      name: 'Datas',
      params: { confeitaria: confStore.slug },
    })
    if (faseAtual.value < etapasStore.etapas.length && faseAtual.value > 0) {
      router.push({
        name: 'Etapas',
        params: { ordem: encomendaStore.etapas.length + 1, confeitaria: confStore.slug },
      })
    } else if (faseAtual.value == etapasStore.etapas.length + 2) {
      router.push({
        name: 'Estilo',
        params: { confeitaria: confStore.slug },
      })
    } else if (faseAtual.value == etapasStore.etapas.length + 3) {
      router.push({
        name: 'Finalizar',
        params: { confeitaria: confStore.slug },
      })
    } else if (faseAtual.value == etapasStore.etapas.length + 4) {
      router.push({
        name: 'Resumo',
        params: { confeitaria: confStore.slug },
      })
    }
  }

  isEntrando.value = false

  setColor(confStore.cor_princ, confStore.cor_sec)
  document.title = confStore.nome
}

const resetAll = () => {
  encomendaStore.$reset()
  confStore.$reset()
  etapasStore.$reset()
  opcoesStore.$reset()
}
</script>

<template>
  <div class="bg-white absolute inset-0 z-1000 flex justify-center items-center" v-if="isEntrando">
    <progress-spinner strokeWidth="4" />
  </div>
  <router-view />
</template>
