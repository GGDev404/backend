import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';
import { FileUpload } from './interfaces/file-upload.interface';

@Injectable()
export class FileService {
  private readonly basePath = join(__dirname, '..', '..', 'uploads');

  async saveFile(file: FileUpload, subfolder: string): Promise<string> {
    try {
      await fs.mkdir(join(this.basePath, subfolder), { recursive: true });
      
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${fileExt}`;
      const filePath = join(this.basePath, subfolder, fileName);

      await fs.writeFile(filePath, file.buffer);
      
      return `/uploads/${subfolder}/${fileName}`;
    } catch (error) {
      throw new InternalServerErrorException('Error al guardar el archivo');
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      const fullPath = join(this.basePath, ...filePath.split('/').slice(2));
      await fs.unlink(fullPath);
    } catch (error) {
      console.error('Error eliminando archivo:', error);
    }
  }
}