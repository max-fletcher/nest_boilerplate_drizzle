import { diskStorage } from "multer";

export const path = 'files_boi'

export const diskStorageEngine = (path: string = '') => {
  return diskStorage({
    // destination: path !== '' ? './src/public/uploads/' + path : './src/public/uploads', // Ensure this folder exists or create it
    destination: './public/uploads',
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