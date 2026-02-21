<script setup lang="ts">
import { InputText, IconField, InputIcon, InputMask, Button, DatePicker } from 'primevue'
import { computed, onMounted, ref, watch } from 'vue'
import PixIcon from '@/components/pixIcon.vue'
import useDadosClienteStore from '@/stores/dadosCliente.store'
import type { ClienteData } from '@/types'
import router from '@/router'
import useConfeitariaStore from '@/stores/confeitaria.store'
import { faseAtual } from '@/constants'
import api from '@/services/api'
import { IndexService } from '@/services'

const invalidCep = ref(false)
const dadosClienteStore = useDadosClienteStore()
const confStore = useConfeitariaStore();
const minSelectableDate = ref<Date>(new Date());

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

const buscarEndereco = async (cep: string) => {
  const cepLimpo = cep.replace(/\D/g, '')

  if (cepLimpo.length === 8) {
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()

      if (!data.erro) {
        invalidCep.value = false
        formData.value.rua = data.logradouro
        formData.value.bairro = data.bairro
        formData.value.cidade = data.localidade
      } else {
        invalidCep.value = true
      }
    } catch (error) {
      console.error('Erro ao buscar o CEP:', error)
    }
  }
}

watch(
  () => formData.value.cep,
  (novoCep) => {
    buscarEndereco(novoCep)
  }
)

const bloquearResumo = computed(() => {
  if (formData.value.nome == '' || formData.value.telefone == '' || formData.value.pagamento == '' || formData.value.dataEntrega==null) return true
  if (formData.value.recebimento == 'entrega') {
    if (formData.value.cep == '' ||
      !formData.value.numero) return true
  }
  return false
})

const resumo = () => {
  if (bloquearResumo.value) return;
  dadosClienteStore.addCliente(formData.value)
  router.push({ name: 'Resumo' }).then(() => {
    faseAtual.value++;
  })
}

const voltar = () => {
  router.push({ name: 'Estilo', params: { confeitaria: confStore.slug } }).then(() => {
    faseAtual.value--;
  })
}


// CHAMAR A API PARA AS DATAS
const indexService = IndexService
const slug = confStore.slug.trim().toLowerCase()
const blockDates = ref<Date[]>([]);
onMounted(() => {
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + 5);
  futureDate.setHours(0, 0, 0, 0);
  minSelectableDate.value = futureDate;
  getBlockDates();
})


const getBlockDates = async () =>{
  const datesArray = await indexService.getBlockDates(slug);
  datesArray.map((date:string)=>{
    const separeteDate = date.split('-');
    if(separeteDate.length == 3){
      const year = parseInt(separeteDate[0]!);
      const month = parseInt(separeteDate[1]!) - 1;
      const day = parseInt(separeteDate[2]!);
      const completeDate = new Date(year,month,day);
      blockDates.value.push(completeDate)
    }
  })
  console.log(blockDates.value)
}



</script>

<template>
  <main class="relative min-h-screen pb-24">
    <div class="m-md p-md rounded-2xl shadow-[0_5px_10px_2px_rgba(0,0,0,0.1)]">
      <h2 class="text-2xl font-bold">Suas Informações</h2>
      <form action="">
        <div class="flex flex-col gap-2 mt-md">
          <label for="nome">Nome completo*</label>
          <IconField>
            <InputIcon class="pi pi-user !text-primary" />
            <InputText class="w-full h-15 !rounded-2xl !caret-primary" name="nome" v-model="formData.nome"
              placeholder="Seu Nome" autocomplete="on" />
          </IconField>
        </div>
        <div class="flex flex-col gap-2 mt-md">
          <label for="telefone">Telefone*</label>
          <IconField>
            <InputIcon class="pi pi-phone !text-primary" />
            <InputMask class="w-full h-15 !rounded-2xl" v-model="formData.telefone" name="telefone"
              mask="(99) 99999-9999" placeholder="(99) 99999-999" />
          </IconField>
        </div>

        <div class="flex flex-col gap-2 mt-md">
          <label for="telefone">Data Entrega*</label>
          <IconField>
            <InputIcon class="pi pi-calendar !text-primary" />
            <DatePicker v-model="formData.dataEntrega" dateFormat="dd/mm/yy" :min-date="minSelectableDate" :disabled-dates="blockDates"/>
          </IconField>
        </div>

        <div class="mt-md">
          <h2 class="text-lg font-bold">Forma de Recebimento</h2>
          <div class="flex items-center gap-2.5 mt-sm">
            <button type="button" class="w-25 rounded-lg" :class="formData.recebimento == 'entrega'
              ? 'bg-primary text-white shadow-[0_2px_2px_1px_rgba(0,0,0,0.2)] p-[10px]'
              : 'border-2 border-primary/50 bg-secondary/50 text-gray-600 p-[8px]'
              " @click="formData.recebimento = 'entrega'">
              Entrega
            </button>
            <button type="button" class="w-25 rounded-lg" :class="formData.recebimento == 'retirada'
              ? 'bg-primary text-white shadow-[0_2px_2px_1px_rgba(0,0,0,0.2)] p-[10px]'
              : 'border-2 border-primary/50 bg-secondary/50 text-gray-600 p-[8px]'
              " @click="formData.recebimento = 'retirada'">
              Retirada
            </button>
          </div>
        </div>

        <div class="mt-lg" v-if="formData.recebimento == 'entrega'">
          <h2 class="text-xl font-bold">Endereço de entrega</h2>

          <div class="flex flex-col gap-2 mt-md">
            <label for="CEP">CEP*</label>
            <IconField>
              <InputIcon class="pi pi-map-marker !text-primary" />
              <InputMask class="w-full h-15 !rounded-2xl" v-model="formData.cep" name="CEP" mask="99999-999"
                placeholder="00000-000" />
            </IconField>
            <div class="ml-sm text-sm text-primary font-bold" v-if="invalidCep">Cep inválido</div>
          </div>
          <div class="flex flex-col gap-2 mt-md">
            <label for="Rua">Rua*</label>
            <InputText class="w-full h-15 !rounded-2xl" name="Rua" v-model="formData.rua" placeholder="Nome da rua"
              autocomplete="on" disabled />
          </div>
          <div class="flex gap-6 mt-md">
            <div class="flex flex-col gap-2">
              <label for="Numero">Numero*</label>
              <InputText type="number" class="w-20 grow h-15 !rounded-2xl text-center" name="Numero"
                v-model="formData.numero" placeholder="123" autocomplete="on" />
            </div>
            <div class="flex flex-col gap-2">
              <label for="Complemento">Complemento</label>
              <InputText class="w-45 h-15 !rounded-2xl" name="Complemento" v-model="formData.referencia"
                placeholder="Apto 4, Bloco A..." autocomplete="on" />
            </div>
          </div>
          <div class="flex flex-col gap-2 mt-md">
            <label for="Bairro">Bairro*</label>
            <InputText class="w-full h-15 !rounded-2xl" name="Bairro" v-model="formData.bairro" placeholder="Seu bairro"
              autocomplete="on" disabled />
          </div>
          <div class="flex flex-col gap-2 mt-md">
            <label for="Cidade">Cidade*</label>
            <InputText class="w-full h-15 !rounded-2xl" name="Cidade" v-model="formData.cidade" placeholder="Sua cidade"
              autocomplete="on" disabled />
          </div>
        </div>

        <div class=" py-2 mt-md text-primary bg-secondary border-2 border-primary rounded-lg text-center font-bold"
          v-else>Retirada
          na confeitaria {{ confStore.nome }} !!!</div>

        <div class="mt-lg">
          <h2 class="text-xl font-bold">Método de pagamento*</h2>
          <div class="grid grid-cols-2 gap-4 h-70 mt-md">
            <div class="flex flex-col justify-center items-center gap-2 border-2 rounded-2xl grow p-sm" :class="formData.pagamento == 'pix'
              ? 'border-primary bg-secondary/50 text-primary'
              : 'border-gray-300 text-gray-500'
              " @click="formData.pagamento = 'pix'">
              <PixIcon :class="formData.pagamento == 'pix'
                ? 'fill-primary'
                : 'fill-gray-500'
                " />
              <div class="text-sm/5 font-medium">PIX</div>
            </div>
            <div class="flex flex-col justify-center items-center gap-2 border-2 rounded-2xl grow p-sm text-center"
              :class="formData.pagamento == 'credito'
                ? 'border-primary bg-secondary/50 text-primary'
                : 'border-gray-300 text-gray-500'
                " @click="formData.pagamento = 'credito'">
              <i class="pi pi-credit-card" style="font-size: 25px" />
              <div class="text-sm/5 font-medium">Cartão de crédito</div>
            </div>
            <div class="flex flex-col justify-center items-center gap-2 border-2 rounded-2xl grow p-sm text-center"
              :class="formData.pagamento == 'debito'
                ? 'border-primary bg-secondary/50 text-primary'
                : 'border-gray-300 text-gray-500'
                " @click="formData.pagamento = 'debito'">
              <i class="pi pi-wallet" style="font-size: 25px" />
              <div class="text-sm/5 font-medium">Cartão de débito</div>
            </div>
            <div class="flex flex-col justify-center items-center gap-2 border-2 rounded-2xl grow p-sm text-center"
              :class="formData.pagamento == 'dinheiro'
                ? 'border-primary bg-secondary/50 text-primary'
                : 'border-gray-300 text-gray-500'
                " @click="formData.pagamento = 'dinheiro'">
              <i class="pi pi-money-bill" style="font-size: 25px" />
              <div class="text-sm/5 font-medium">Dinheiro</div>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div
      class="flex justify-center gap-3 fixed bottom-0 w-full p-md h-24 shadow-[0px_-1px_4px_0px_rgba(0,0,0,0.1)] bg-white z-100">
      <Button label="Voltar" icon="pi pi-angle-left"
        class="w-50 !bg-secondary !border-2 !border-pink-100 !text-gray-500 hover:!border-primary hover:!text-primary"
        severity="secondary" @click="voltar" />
      <Button label="Resumo" icon="pi pi-angle-right" icon-pos="right" class="grow w-full max-w-75 !bg-primary" raised
        :disabled="bloquearResumo" @click="resumo" />
    </div>
  </main>
</template>

<style scoped>
.p-button {
  appearance: none;
  border: none;
  border-radius: 15px;
}
</style>
