import { Imagem } from "./Imagem";
import { Match } from "./Match";
import { Tag } from "./Tags";
import { Usuario } from "./usuario";

export interface Pessoa {
    id: number;
    usuario_id: number;
    curso?: string;
    data_de_nascimento?: Date;
    periodo?: string;
    genero?: string;
    sexualidade?: string;
    descricao?: string;
    ativo?: boolean;
    instagram?: string;
    whatsapp?: string;
    telegram?: string;
    created_at?: Date;
    updated_at?: Date;
    
   
    usuario?: Usuario; // Dados de autenticação
    imagens?: Imagem[]; // Lista de imagens
    tags?: Tag[]; // Tags através de pessoa_tags
    matches?: Match[]; // Matches relacionados
}