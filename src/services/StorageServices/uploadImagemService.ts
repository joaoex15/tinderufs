import fs from 'fs';
import { pool } from '../../Data/db';
import { driveService, GOOGLE_API_FOLDER_ID } from '../../Data/storage';
import { Imagem } from '../../models/Imagem';

export const uploadFileService = async (fileName: string, pessoaId: number): Promise<Imagem> => {
    const fileMetadata = {
        name: fileName,
        parents: [GOOGLE_API_FOLDER_ID],
    };

    const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(`src/${fileName}`),
    };

    const response = await driveService.files.create({
        resource: fileMetadata,
        media,
        fields: 'id',
    });

    const caminho = `https://drive.google.com/uc?export=view&id=${response.data.id}`;

    const query = `
        INSERT INTO imagens (pessoa_id, caminho_arquivo)
        VALUES ($1, $2)
        RETURNING *;
    `;
    const values = [pessoaId, caminho];
    const result = await pool.query(query, values);

    return result.rows[0];
};
