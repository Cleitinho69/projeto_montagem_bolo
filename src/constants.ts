import { ref, watch } from "vue"

const faseSalva = localStorage.getItem("fase_usuario");
export const faseAtual = ref(faseSalva ? parseInt(faseSalva) : 1);

export const criandoEncomenda = ref(false);

watch(faseAtual, (novoValor) => {
  localStorage.setItem("fase_usuario", novoValor.toString());
}, { immediate: true });

export {}
