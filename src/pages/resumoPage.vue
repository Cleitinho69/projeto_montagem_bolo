<script setup lang="ts">
import { criandoEncomenda, faseAtual } from '@/constants'
import router from '@/router'
import useConfeitariaStore from '@/stores/confeitaria.store'
import useDadosClienteStore from '@/stores/dadosCliente.store'
import useEstiloStore from '@/stores/estilos.store'
import useEtapasStore from '@/stores/etapas.store'
import useOpcoesStore from '@/stores/opcoes.store'
import { Button } from 'primevue'
import { ref } from 'vue'
import dialogFinalization from '@/components/dialogFinalization.vue'
import { IndexService } from '@/services'
import useEncomendaStore from '@/stores/encomenda.store'

const etapasStore = useEtapasStore()
const opcoesStore = useOpcoesStore()
const clienteStore = useDadosClienteStore();
const estiloStore = useEstiloStore();
const confStore = useConfeitariaStore();
const encomendaStore = useEncomendaStore();

const showParabenizacao = ref(false);

const opcoesSelect = opcoesStore.opcoes.filter(op => op.select == true);

const encontrarOpcoes = (id: number) => {
  const opCorres = opcoesSelect.filter(op => op.id_etapa == id);

  const nomeOp = opCorres.map((op) => { return op.nome });

  return nomeOp
}

const voltar = () => {
  router.push({ name: 'Finalizar' }).then(() => {
    faseAtual.value--
  })
}

const generateWhatsAppLink = () => {
  const baseUrl = "https://api.whatsapp.com/send";

  const message = encodeURIComponent(
    `Olá! Acabei de fazer um pedido no site e aqui estão os detalhes:\n\n` +
    `🍪 *Pedido:* #${encomendaStore.code}\n` +
    `👤 *Cliente:* ${clienteStore.nome}\n` +
    `🍰 *Estilo:* ${estiloStore.estilos.find(es => es.id == encomendaStore.estilo.id)?.titulo}\n` +
    `💳 *Pagamento:* ${clienteStore.pagamento}\n\n` +
    `Poderia me confirmar o recebimento?`
  );

  return `${baseUrl}?phone=55${confStore.telefone}&text=${message}`;
}

const enviarMensagem = async() => {
  faseAtual.value = 1;
  const linkFinal = generateWhatsAppLink();
  window.open(linkFinal, '_blank');
  encomendaStore.$reset();
  etapasStore.$reset();
  opcoesStore.$reset();
  estiloStore.$reset();
  confStore.$reset();
  window.location.reload()
}

const finalizar = async () => {
  showParabenizacao.value = true

  document.body.style.overflow = 'hidden';

  try {
    criandoEncomenda.value = true;
    if (!clienteStore.dataEntrega) return;

    const newEncomenda = {
      pagamento: clienteStore.pagamento,
      observacoes: 'nada',
      data_entrega: (clienteStore.dataEntrega ? new Date(clienteStore.dataEntrega).toLocaleDateString() : '').toString().split('/').reverse().join('-'),
      cliente: {
        nome: clienteStore.nome,
        telefone: clienteStore.telefone.trim().replace(/[^a-zA-Z0-9]/g, ''),
        cep: clienteStore.cep,
        cidade: clienteStore.cidade,
        bairro: clienteStore.bairro,
        rua: clienteStore.rua,
        numero: clienteStore.numero,
        complemento: clienteStore.referencia ?? '',
      },
      etapas: encomendaStore.etapas,
      estilo: encomendaStore.estilo
    }
    const data = await IndexService.addEncomenda(confStore.slug, newEncomenda);
    encomendaStore.code = data.code;
  } catch (error) {
    console.error(error)
    alert(error)
    throw error
  } finally {
    criandoEncomenda.value = false;
  }
}
</script>

<template>
  <dialogFinalization @enviar_mensagem="enviarMensagem" v-show="showParabenizacao" />
  <main class=" relative p-md pb-24">
    <h2 class="text-2xl font-bold">Resumo do Pedido</h2>
    <span class="text-sm/10 font-medium text-gray-400">Confira todos os detalhes</span>

    <div class="card p-md rounded-2xl shadow-[0_5px_10px_2px_rgba(0,0,0,0.1)] mt-md flex flex-col gap-6">
      <div class="flex items-center gap-3">
        <h3 class="text-xl font-bold">Informações de Contato</h3>
      </div>
      <ul class="flex flex-col gap-2">
        <!-- <li v-for="etapas in encomendaStore.etapas" :key="etapas.id">
          <div>{{ etapasStore.etapas.find(et=>etapas.id===et.id)?.nome }}</div>
        </li> -->
        <li class="flex items-center gap-3 min-h-15">
          <div class="w-10 h-10 bg-secondary/50 text-primary rounded-xl flex justify-center items-center">
            <i class="pi pi-user"></i>
          </div>
          <div>
            <div class="text-xs">Nome</div>
            <div class="font-semibold text-sm">{{ clienteStore.nome }}</div>
          </div>
        </li>
        <li class="flex items-center gap-3 min-h-15">
          <div class="w-10 h-10 bg-secondary/50 text-primary rounded-xl flex justify-center items-center">
            <i class="pi pi-phone"></i>
          </div>
          <div>
            <div class="text-xs">Telefone</div>
            <div class="font-semibold text-sm">{{ clienteStore.telefone }}</div>
          </div>
        </li>
        <li class="flex items-center gap-3 min-h-15">
          <div class="w-10 h-10 bg-secondary/50 text-primary rounded-xl flex justify-center items-center">
            <i class="pi pi-calendar"></i>
          </div>
          <div>
            <div class="text-xs">Data Entrega</div>
            <div class="font-semibold text-sm">{{ clienteStore.dataEntrega ? new
              Date(clienteStore.dataEntrega).toLocaleDateString('pt-BR') : '' }}</div>
          </div>
        </li>
        <li class="flex items-start gap-3 h-fit">
          <div class="w-10 h-10 bg-secondary/50 text-primary rounded-xl flex justify-center items-center">
            <i class="pi pi-map-marker"></i>
          </div>
          <div v-if="clienteStore.recebimento == 'entrega'">
            <div class="text-xs">Endereço</div>
            <div class="font-semibold text-sm">{{ clienteStore.rua }}, {{ clienteStore.numero }} - {{
              clienteStore.referencia }}</div>
            <div class="font-semibold text-sm">{{ clienteStore.bairro }}, {{ clienteStore.cidade }}</div>
            <div class="font-semibold text-sm">Cep: {{ clienteStore.cep }}</div>
          </div>
          <div v-else>
            <div class="text-xs">Retirada</div>
            <div class="font-semibold text-sm">Confeitaria {{ confStore.nome }}</div>
          </div>
        </li>
        <li class="flex items-center gap-3 min-h-15">
          <div class="w-10 h-10 bg-secondary/50 text-primary rounded-xl flex justify-center items-center">
            <i class="pi pi-money-bill"></i>
          </div>
          <div>
            <div class="text-xs">Metodo de Pagamento</div>
            <div class="font-semibold text-sm">{{ clienteStore.pagamento }}</div>
          </div>
        </li>
      </ul>
    </div>

    <div class="card p-md rounded-2xl shadow-[0_5px_10px_2px_rgba(0,0,0,0.1)] mt-xl flex flex-col gap-6">
      <div class="flex items-center gap-3">
        <div
          class="flex justify-center items-center bg-linear-to-b from-primary/50 to-primary text-white rounded-2xl w-10 h-10 shadow-[0px_1px_2px_0px_rgba(0,0,0,0.6)]">
          <i class="pi pi-check"></i>
        </div>
        <h3 class="text-xl font-bold">Especificações</h3>
      </div>
      <ul class="flex flex-col">
        <li v-for="etapa in etapasStore.etapas" class="flex justify-between items-center min-h-15" :key="etapa.id">
          <h6 class="font-medium text-gray-400">{{ etapa.nome.charAt(0).toUpperCase() + etapa.nome.slice(1) }}</h6>
          <div class="font-bold line-clamp ">{{ encontrarOpcoes(etapa.id).join(', ') }}</div>
        </li>
      </ul>
    </div>

    <div
      class="card bg-linear-to-b from-primary/50 to-primary text-white p-md rounded-2xl shadow-[0_5px_5px_1px_rgba(0,0,0,0.2)] flex justify-between items-cente mt-lg mb-6">
      <h3 class="text-2xl font-bold">Total:</h3>
      <div class="text-xl font-bold">R$ {{ (opcoesStore.valorOpcoes + estiloStore.valorEstilo).toFixed(2).replace('.',
        ',')
      }}</div>
    </div>

    <div
      class="flex justify-center gap-3 fixed bottom-0 left-0 w-full p-md h-24 shadow-[0px_-1px_4px_0px_rgba(0,0,0,0.1)] bg-white z-100">
      <Button label="Voltar" icon="pi pi-angle-left"
        class="w-50 !bg-secondary !border-2 !border-pink-100 !text-gray-500 hover:!border-primary hover:!text-primary"
        severity="secondary" @click="voltar" />
      <Button label="Finalizar" icon="pi pi-angle-right" icon-pos="right" class="grow w-full max-w-75 !bg-primary"
        raised @click="finalizar" />
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
