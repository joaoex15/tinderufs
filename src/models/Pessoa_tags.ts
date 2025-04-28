import { Pessoa } from "./Pessoa";
import { InteresseTag } from "./Tags";

export interface PessoaTag {
    id: number;
    pessoa_id: number;
    tag_id: string;
    created_at?: Date;
    
    // Relacionamentos opcionais
    pessoa?: Pessoa;
    tag?: InteresseTag;
}
