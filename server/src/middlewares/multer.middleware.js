import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'

const __fileName = fileURLToPath(import.meta.url)
const __dirName = path.dirname(__fileName)

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirName, '..', '..', '/public', '/temp'))
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + '-' + file.originalname)
    }
})

export const upload = multer({ storage: storage })