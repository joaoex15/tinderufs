export interface Imagem {
    id: number;
    pessoa_id: number;
    tipo_imagem: string;
    caminho_arquivo: string;
    nome_arquivo: string;
    extensao: string;
    tamanho?: number;
    largura?: number;
    altura?: number;
    is_principal?: boolean;
    ordem?: number;
    created_at?: Date;
}