export interface Confeitaria {
  id: number,
  nome: string,
  slug: string,
  cor_princ: string,
  cor_sec: string,
  logo: string
}

export interface Etapa {
  id: number,
  id_con: number,
  nome: string,
  ordem: number,
  icone: string,
  required: boolean,
  multiple: boolean
}

export interface Opcao {
  active: boolean,
  descricao: string,
  etapa: EtapaOpcao,
  id: number,
  id_etapa: number,
  nome: string,
  valor: number,
  select: boolean,
}


export interface EtapaOpcao {
  id: number,
  nome: string,
}

export interface Estilo {
  id: number,
  imagem: string,
  valor: number,
  descricao: string,
  titulo: string,
  select: boolean,
}

export interface ClienteData {
  nome: string,
  telefone: string,
  dataEntrega: Date | null,
  recebimento: string,
  cep: string,
  rua: string,
  numero: string,
  bairro: string,
  cidade: string,
  referencia: string,
  pagamento: string,
}

export interface EncomendaData {
  code: string
}

export { }
