import { Pessoa } from "./Pessoa";

export interface Match {
    id: number;
    pessoa_1_id: number;
    pessoa_2_id: number;
    eh_amizade: boolean;
    status: 'pendente' | 'aceito' | 'recusado' | 'bloqueado';
    created_at?: Date;
    updated_at?: Date;
    
    // Relacionamentos opcionais
    pessoa_1?: Pessoa;
    pessoa_2?: Pessoa;
}