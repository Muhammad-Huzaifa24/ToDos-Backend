import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "./cloudinary.js";

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "toDo_app_pictures",
        allowed_formats: ["jpg", "png", "jpeg"],
        public_id: (req, file) => `${Date.now()}-${file.originalname}`,  // Unique file name
    },
});

const upload = multer({ storage });

export default upload;
