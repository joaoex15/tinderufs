import { pool } from '../../Data/db';
import { driveService } from '../../Data/storage';

export const deleteImagemById = async (imagemId: number): Promise<boolean> => {
    const result = await pool.query(
        'SELECT caminho_arquivo FROM imagens WHERE id = $1',
        [imagemId]
    );

    if (result.rows.length === 0) return false;

    const caminho = result.rows[0].caminho_arquivo;
    const fileId = extrairIdGoogleDrive(caminho);

    await driveService.files.delete({ fileId });

    await pool.query('DELETE FROM imagens WHERE id = $1', [imagemId]);

    return true;
};

function extrairIdGoogleDrive(url: string): string {
    const match = url.match(/id=([a-zA-Z0-9_-]+)/);
    return match ? match[1] : '';
}
