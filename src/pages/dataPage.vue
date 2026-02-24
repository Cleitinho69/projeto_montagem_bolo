<script lang="ts" setup>
import { IndexService } from '@/services'
import useConfeitariaStore from '@/stores/confeitaria.store'
import { onMounted, ref } from 'vue'
const confStore = useConfeitariaStore()
import useDadosClienteStore from '@/stores/dadosCliente.store'
import type { ClienteData } from '@/types'
import { Button, DatePicker, IconField, InputIcon } from 'primevue'
import { usePrimeVue } from 'primevue/config'
import { date } from '@primeuix/themes/aura/datepicker'
import LoadingSpinner from '@/components/loadingSpinner.vue'
const primevue = usePrimeVue()
const dadosClienteStore = useDadosClienteStore()
const encomendaStore = useEncomendaStore();
const formData = ref<ClienteData>({
  nome: dadosClienteStore.nome,
  telefone: dadosClienteStore.telefone,
  dataEntrega: dadosClienteStore.dataEntrega ? new Date(dadosClienteStore.dataEntrega) : null,
  recebimento: dadosClienteStore.recebimento,
  cep: dadosClienteStore.cep,
  rua: dadosClienteStore.rua,
  numero: dadosClienteStore.numero,
  bairro: dadosClienteStore.bairro,
  cidade: dadosClienteStore.cidade,
  referencia: dadosClienteStore.referencia,
  pagamento: dadosClienteStore.pagamento,
})

import Toast from 'primevue/toast'

// CHAMAR A API PARA AS DATAS
const indexService = IndexService
const slug = confStore.slug.trim().toLowerCase()
const blockDates = ref<Date[]>([])
const minSelectableDate = ref<Date>(new Date())
onMounted(() => {
  // MUDAR PARA PTBR
  if (primevue.config.locale) {
    primevue.config.locale.dayNamesMin = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
    primevue.config.locale.monthNames = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ]
    primevue.config.locale.firstDayOfWeek = 0
  }
  const today = new Date()
  const futureDate = new Date()
  futureDate.setDate(today.getDate() + 5)
  futureDate.setHours(0, 0, 0, 0)
  minSelectableDate.value = futureDate
  getBlockDates()
})

const loading = ref(false)
import { useToast } from 'primevue/usetoast'
import router from '@/router'
import { faseAtual } from '@/constants'
import useEncomendaStore from '@/stores/encomenda.store'
const toast = useToast()
const dateValid = ref(false)

// PEGAR AS DATAS BLOQUEADAS
const getBlockDates = async () => {
  loading.value != loading.value
  const datesArray = await indexService.getBlockDates(slug)
  datesArray.map((date: string) => {
    const separeteDate = date.split('-')
    if (separeteDate.length == 3) {
      const year = parseInt(separeteDate[0]!)
      const month = parseInt(separeteDate[1]!) - 1
      const day = parseInt(separeteDate[2]!)
      const completeDate = new Date(year, month, day)
      blockDates.value.push(completeDate)
    }
  })
  loading.value != loading.value
}

const checkDate = async (data: Date) => {
  loading.value = true
  const date = data.toLocaleDateString().toString().split('/').reverse().join('-')

  const response = await indexService.checkDateStatus(confStore.slug, date)
  if (response.status) {
    dateValid.value = true
    dadosClienteStore.addCliente(formData.value);
  } else {
    blockDates.value.push(data)
    toast.add({ severity: 'error', summary: 'Aviso', detail: 'Data Indisponvivel', life: 3000 })
  }
  loading.value = false
}

// IR PARA A PROXIMA PAGINA
const next = () => {
  router
    .push({
      name: 'Etapas',
      params: { ordem: 1, confeitaria: confStore.slug },
    });
}
</script>

<template>
  <main class="relative min-h-screen pb-24">
    <LoadingSpinner :loading="loading" />
    <Toast position="bottom-right" class="w-full" />
    <div class="m-md p-md rounded-2xl shadow-[0_5px_10px_2px_rgba(0,0,0,0.1)]">
      <h2 class="text-2xl font-bold">Data para entrega</h2>
      <h3 class="mt-sm text-md">Selecione a data para a encomenda:</h3>
      <form action="" class="w-full flex align-middle justify-center">
        <div class="flex flex-col gap-2 mt-md align-middle justify-center w-full">
          <IconField class="w-full flex align-middle justify-center">
            <DatePicker
              v-model="formData.dataEntrega"
              dateFormat="dd/mm/yy"
              :min-date="minSelectableDate"
              :disabled-dates="blockDates"
              inline
              class="w-full sm:w-[30rem]"
              locale="ptBR"
              v-on:date-select="checkDate"
            />
          </IconField>
        </div>
      </form>
      <div class="flex justify-center w-full p-md">
        <Button
          label="Proximo"
          icon="pi pi-angle-right"
          icon-pos="right"
          class="grow w-full max-w-75 !bg-primary"
          raised
          :disabled="!dateValid"
          @click="next()"
        />
      </div>
    </div>
  </main>
</template>
