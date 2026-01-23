<script setup lang="ts">
import { Button } from 'primevue'
import { computed, ref, watch } from 'vue'
import { IndexService } from '@/services'
import useConfeitariaStore from '@/stores/confeitaria.store'
import useEtapasStore from '@/stores/etapas.store'
import useOpcoesStore from '@/stores/opcoes.store'
import useEncomendaStore from '@/stores/encomenda.store'
import { url } from '@/services/api'
import router from '@/router'
import type { Opcao } from '@/types'
import { faseAtual } from '@/constants'
import CakeIcon from '@/components/cakeIcon.vue'

interface OpcaoId {
  id: number
}

interface Props {
  ordem: number
}

const props = defineProps<Props>()

const encomendaStore = useEncomendaStore()
const confStore = useConfeitariaStore()
const etapasStore = useEtapasStore()
const opcoesStore = useOpcoesStore()
const indexService = IndexService

const opcoesAtual = computed(() => {
  return opcoesStore.opcoes.filter((op) => op.id_etapa == etapaAtual.value?.id)
})

const etapaAtual = computed(() => {
  return etapasStore.etapas.find((et) => et.ordem == props.ordem)
})

const opcoesEscolhidas = ref<OpcaoId[]>([])

watch(
  () => etapaAtual.value,
  async () => {
    if (etapaAtual.value) {
      const slug = confStore.slug.trim().toLowerCase()

      const { opcoes } = await indexService.getOpcoes(slug, etapaAtual.value.id)

      faseAtual.value = props.ordem;

      opcoesEscolhidas.value =
        encomendaStore.etapas.find((et) => et.id == etapaAtual.value?.id)?.opcoes ?? []

      opcoes.forEach((op) => opcoesStore.addOpcao(op, opcoesEscolhidas.value))
    }
  }
)

const toogleOpcao = (opcao: Opcao) => {
  const index = opcoesEscolhidas.value.findIndex((op) => op.id === opcao.id)

  if (index !== -1) {
    // if (opcoesEscolhidas.value.length == 1 && etapaAtual.value?.required && etapaAtual.value.multiple) return
    opcao.select = false
    opcoesEscolhidas.value.splice(index, 1)
  } else if (etapaAtual.value?.multiple) {
    opcoesEscolhidas.value.push({ id: opcao.id })
    opcao.select = true
  } else if (!etapaAtual.value?.multiple) {
    const selecAnterior = opcoesStore.opcoes.find(
      (op) => op.id_etapa == etapaAtual.value?.id && op.select == true
    )

    if (selecAnterior) selecAnterior.select = false

    opcoesEscolhidas.value = [{ id: opcao.id }]
    opcao.select = true
  }
}

const permitirProximaEtapa = computed(() => {
  if (etapaAtual.value?.required && !opcoesAtual.value.some(op => op.select == true)) return false;
  return true
})

const permitirVoltarEtapa = computed(() => {
  if (props.ordem > 1) return true
  return false
})

const proximaEtapa = () => {
  if (etapaAtual.value) {
    if (etapaAtual.value.required && !opcoesEscolhidas.value.length) return

    encomendaStore.saveEtapaOpcao(etapaAtual.value.id, opcoesEscolhidas.value)

    opcoesEscolhidas.value = []

    if (etapasStore.etapas.length > etapaAtual.value.ordem) {
      router
        .push({
          name: 'Etapas',
          params: { ordem: props.ordem + 1 },
        })
        .then(() => {
          faseAtual.value++
        })
    } else
      router.push({ name: 'Estilo' }).then(() => {
        faseAtual.value++
      })
  }
}

const voltarEtapa = () => {
  if (!permitirVoltarEtapa.value) return
  router
    .push({ name: 'Etapas', params: { ordem: props.ordem - 1, confeitaria: confStore.slug } })
    .then(() => {
      faseAtual.value--
    })
}
</script>

<template>
  <section class="px-md pb-30">
    <h2 class="mt-sm text-2xl font-bold" v-if="etapaAtual?.nome">
      {{ etapaAtual.nome.charAt(0).toUpperCase() + etapaAtual.nome.slice(1) }}
    </h2>

    <h3 class="mt-sm text-md" v-if="!etapaAtual?.multiple">Escolha uma das opcões abaixo:</h3>
    <h3 class="mt-sm text-md" v-else>Selecione algumas opções abaixo:</h3>

    <ul class="select flex justify-center gap-2 flex-wrap mt-md" v-if="!etapaAtual?.multiple">
      <li v-for="opcao in opcoesAtual"
        class="relative grow flex flex-col justify-center items-center gap-2 w-40 min-h-40 rounded-2xl border-3 p-sm"
        :class="opcao.select ? 'border-primary bg-secondary/30 border-4 shadow-md' : 'border-secondary'
          " :key="opcao.id" @click="toogleOpcao(opcao)">
        <div
          class="rounded-full h-7 w-7 absolute -right-3 -top-3 flex justify-center items-center text-white bg-primary"
          v-if="opcao.select">
          <i class="pi pi-check"></i>
        </div>
        <div class="rounded-full pt-sm">
          <CakeIcon class="h-15" :class="opcao.select ? 'fill-primary' : 'fill-gray-500'"
            v-if="etapaAtual?.icone == '/storage/semIcone.svg'" />
          <img class="h-15" :src="url + etapaAtual?.icone" alt="" v-else />
        </div>
        <div class="flex flex-col justify-center items-center">
          <h3 class="text-lg/8 font-bold">
            {{ opcao.nome }}
          </h3>
          <div class="text-center text-caption/3 font-medium text-gray-400 line-clamp-4 text-wrap">
            {{ opcao.descricao }}
          </div>
        </div>
        <div class="h-10 flex justify-end items-center font-bold"
          :class="opcao.select ? 'text-primary' : 'text-gray-500'">
          <span v-if="opcao.valor > 0"> +R$ {{ opcao.valor.toFixed(2).replace('.', ',') }} </span>
          <span v-else>Incluido</span>
        </div>
      </li>
    </ul>

    <ul class="select flex gap-2 flex-wrap mt-md" v-else>
      <li v-for="opcao in opcoesAtual" class="flex justify-center items-center p-sm w-full h-22 rounded-2xl" :class="opcao.select
        ? 'border-primary bg-secondary/30 border-3 shadow-md'
        : 'border-secondary border-3'
        " :key="opcao.id" @click="toogleOpcao(opcao)">
        <div class="flex justify-center items-center w-12 h-12 mr-2 rounded-md"
          :class="opcao.select ? 'bg-primary' : 'bg-secondary'">
          <CakeIcon class="h-8" :class="opcao.select ? 'fill-white' : 'fill-primary'"
            v-if="etapaAtual?.icone == '/storage/semIcone.svg'" />
          <img class="h-10" :src="url + etapaAtual?.icone" alt="" v-else />
        </div>
        <div class="w-30 pr-sm">
          <h3 class="font-bold text-lg/4">{{ opcao.nome }}</h3>
          <p class="ml-[2px] mt-1 text-caption/3 font-medium text-gray-400 line-clamp-2" v-if="opcao.descricao">
            {{ opcao.descricao }}
          </p>
        </div>
        <div class="grow flex justify-end items-center font-bold"
          :class="opcao.select ? 'text-primary' : 'text-gray-500'">
          <span v-if="opcao.valor > 0"> +R$ {{ opcao.valor.toFixed(2).replace('.', ',') }} </span>
          <span v-else>Incluido</span>
          <div class="ml-sm flex items-center justify-center rounded-full w-6 h-6 border-2 text-white"
            :class="opcao.select ? 'border-primary bg-primary' : 'border-gray-300'">
            <i class="pi pi-check" v-if="opcao.select"></i>
          </div>
        </div>
      </li>
    </ul>
  </section>
  <div
    class=" bg-white flex justify-center gap-3 fixed bottom-0 w-full p-md h-24 shadow-[0px_-1px_4px_0px_rgba(0,0,0,0.1)]">
    <Button label="Voltar" icon="pi pi-angle-left"
      class="w-50 !bg-secondary !border-2 !border-pink-100 !text-gray-500 hover:!border-primary hover:!text-primary"
      severity="secondary" v-if="permitirVoltarEtapa" @click="voltarEtapa" />
    <Button label="Continuar" icon="pi pi-angle-right" icon-pos="right" class="grow w-full max-w-75 !bg-primary"
      @click="proximaEtapa" raised :disabled="!permitirProximaEtapa" />
  </div>
</template>

<style scoped>
.p-button {
  appearance: none;
  border: none;
  border-radius: 15px;
}
</style>
