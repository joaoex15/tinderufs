import { Request, Response } from 'express';
import { deleteImagemById } from './../services/StorageServices/deleteImagemService';
import { getImagensByPessoaId } from './../services/StorageServices/getImagemService';
import { uploadFileService } from './../services/StorageServices/uploadImagemService';

export const uploadImagem = async (req: Request, res: Response) => {
    try {
        const { pessoa_id, fileName } = req.body;

        if (!pessoa_id || !fileName) {
             res.status(400).json({ error: 'pessoa_id e fileName são obrigatórios.' });
        }

        const imagem = await uploadFileService(fileName, pessoa_id);
        res.status(201).json(imagem);
    } catch (error) {
        console.error('Erro ao fazer upload da imagem:', error);
        res.status(500).json({ error: 'Erro interno ao fazer upload da imagem.' });
    }
};

export const getImagensPorPessoa = async (req: Request, res: Response) => {
    try {
        const pessoaId = Number(req.params.pessoa_id);

        if (isNaN(pessoaId)) {
             res.status(400).json({ error: 'ID da pessoa inválido.' });
        }

        const imagens = await getImagensByPessoaId(pessoaId);
        res.status(200).json(imagens);
    } catch (error) {
        console.error('Erro ao buscar imagens:', error);
        res.status(500).json({ error: 'Erro interno ao buscar imagens.' });
    }
};

export const deletarImagem = async (req: Request, res: Response) => {
    try {
        const imagemId = Number(req.params.id);

        if (isNaN(imagemId)) {
             res.status(400).json({ error: 'ID da imagem inválido.' });
        }

        const sucesso = await deleteImagemById(imagemId);

        if (!sucesso) {
             res.status(404).json({ error: 'Imagem não encontrada.' });
        }

        res.status(200).json({ message: 'Imagem deletada com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar imagem:', error);
        res.status(500).json({ error: 'Erro interno ao deletar imagem.' });
    }
};
