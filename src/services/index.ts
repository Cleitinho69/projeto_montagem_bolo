import api from './api'
import type { Confeitaria, EncomendaData, Estilo, Etapa, Opcao } from '@/types'

interface ResGetInitial {
  confeitaria: Confeitaria
  etapas: Etapa[]
}

interface ResGetOpcao {
  opcoes: Opcao[]
}

interface ResGetEstilo {
  estilos: Estilo[]
}

export const IndexService = {
  async getInitialData(slug: string): Promise<ResGetInitial> {
    const data = (await api.get<ResGetInitial>(`/${slug}/encomenda`)).data
    return data
  },
  async getOpcoes(slug: string, idEtapa: number) {
    const data = (await api.post<ResGetOpcao>(`/${slug}/encomenda/${idEtapa}`)).data
    return data
  },
  async getEstilos(slug: string) {
    const data = (await api.get<ResGetEstilo>(`/${slug}/encomenda/estilos`)).data
    return data
  },
  async addEncomenda(slug: string, dados: object) {
    const data = (await api.post<EncomendaData>(`/${slug}/newencomenda`, dados)).data
    console.log(data);
    return data
  },
  async getBlockDates(slug: string) {
    const data = (await api.get(`/${slug}/encomenda/blockdates`)).data
    return data
  },
  async checkDateStatus(slug: string, date:string) {
    const data = (await api.get(`/${slug}/encomenda/checkdate/${date}`)).data
    return data
  },
}
