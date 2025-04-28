import { Imagem } from "../Imagem";
import { Pessoa } from "../Pessoa";
import { InteresseTag } from "../Tags";

export interface PerfilCompleto extends Pessoa {
    imagens_principais: Imagem[];
    tags_principais: InteresseTag[];
    total_matches: number;
}
