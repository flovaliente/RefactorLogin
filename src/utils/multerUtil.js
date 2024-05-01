import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
      callback(null, 'public/img');
    },
    filename: (req, file, callback) => {
      callback(null, file.originalname);
    },
  });
  
  export const uploader = multer({ storage });