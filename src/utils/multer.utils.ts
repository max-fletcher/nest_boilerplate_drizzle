import { diskStorage } from "multer";
import { Request } from 'express';

export const path = 'files_boi'

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

  return diskStorage({
    // destination: path !== '' ? './public/uploads/' + path : './public/uploads', // Ensure this folder exists or create it
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
  console.log('req files', req.files, 'files', files);

  if (!Object.keys(files!).length) return;

  const formatted_paths: formattedPathsType = {};

  Object.entries(files!).map((element: any) => {
    let paths: Array<string> = [];
    element[1].map((fields: fieldsType) => {
      // console.log('fields', fields);
      paths = [
        (!process.env.FILE_BASE_URL || process.env.FILE_BASE_URL === ''
          ? req.protocol + '://' + req.get('host')
          : process.env.FILE_BASE_URL) +
          '/' +
          fields.path
            .substring(
              fields.path.indexOf('\\') + 1,
              fields.path.lastIndexOf('\\'),
            )
            .replace('public\\', '')
            .replace('\\', '/') +
          '/' +
          fields.filename,
        ...paths,
      ];
    });

    formatted_paths[element[0]] = paths;
  });

  return formatted_paths;
};