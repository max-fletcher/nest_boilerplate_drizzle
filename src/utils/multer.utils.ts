import { diskStorage } from "multer";
import { Request } from 'express';
import * as fs from 'fs';

export type formattedPathsType = {
  [key: string]: string[];
};

export type fieldsType = {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  destination: string;
  filename: string;
  path: string;
  size: number;
};

export const diskStorageEngine = (path: string = '') => {
  const dir = './public/uploads/' + path;
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); // create folder if it doesn't exist

  return diskStorage({
    destination: dir,
    filename: (req, file, cb) => {
      const randomNum = Math.floor(Math.random() * (9999 - 1000 + 1) + 1000);
      const filename =
        Date.now() +
        randomNum +
        '-' +
        file.originalname.trim().replaceAll(' ', '_');

      cb(null, filename);
    },
  })
}

export const additionalValidation = (maxSize) => {
  return (req, file, cb) => {
    const fileSize = parseInt(req.headers['content-length']!);
    if (fileSize > maxSize) {
      req.body.file_upload_status = 'File too big to be uploaded to server';
      return cb(null, false);
    }
  
    return cb(null, true);
  };
}

export const multipleFileLocalFullPathResolver = (req: Request, files: any) => {
  if (!Object.keys(files!).length) return;
  const formatted_paths: formattedPathsType = {};

  Object.entries(files).forEach(([fieldName, files]) => {
    const paths = (files as Express.Multer.File[]).map((file) => {
      const publicUrl =
        process.env.FILE_BASE_URL && process.env.FILE_BASE_URL !== ''
          ? process.env.FILE_BASE_URL
          : `${req.protocol}://${req.get('host')}`;

      return `${publicUrl}/${file.path.replace(/\\/g, '/').replace('/public', '')}`;
    });

    formatted_paths[fieldName] = paths;
  });

  return formatted_paths;
};

export const rollbackMultipleFileLocalUpload = async (req: Request) => {
  // IF EXISTS/NOT EMPTY CHECK
  if (!Object.keys(req.files!).length) return;

  Object.values(req.files!).forEach(async (fields: fieldsType[]) => {
    fields.map(async (field: fieldsType) => {
      const directoryPath = field.path.replaceAll('\\', '/');

      console.log('222', 'field', field, 'directoryPath', directoryPath, fs.existsSync(directoryPath)) 
      // IF EXISTS/NOT EMPTY CHECK. DUNNO WHAT TO DO WITH THIS...
      if (field && fs.existsSync(directoryPath)) {
        await fs.unlinkSync(directoryPath);
        console.log('333', fs.existsSync(directoryPath))
      }
    });
  });

  return;
};