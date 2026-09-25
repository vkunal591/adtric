import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

const apiDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const uploadDirectory = path.join(apiDirectory, "uploads");

fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
	destination: (_req, _file, callback) => {
		callback(null, uploadDirectory);
	},
	filename: (_req, file, callback) => {
		const extension = path.extname(file.originalname).toLowerCase();
		const baseName = path
			.basename(file.originalname, extension)
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "") || "image";

		callback(null, `${baseName}-${Date.now()}${extension}`);
	}
});

const fileFilter = (_req, file, callback) => {
	const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
	const extension = path.extname(file.originalname).toLowerCase();
	const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

	if (!allowedExtensions.includes(extension) || !allowedMimeTypes.includes(file.mimetype)) {
		const error = new Error("Upload a valid JPG, PNG, or WebP image.");
		error.statusCode = 400;
		return callback(error);
	}

	return callback(null, true);
};

const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 2 * 1024 * 1024,
		files: 1
	}
});

export default upload;
