import { Match } from "../Match";
import { Pessoa } from "../Pessoa";
import { InteresseTag } from "../Tags";

export interface MatchCompleto {
    match: Match;
    outra_pessoa: Pessoa;
    tags_comuns: InteresseTag[];
}