import multer from "multer";
import path from "path"

const AllowedExtensions = [".csv",".xls",".xlsx"]

const upload = multer({
    storage :multer.memoryStorage(),
    fileFilter :(req,file,cb)=>{
        const ext = path.extname(file.originalname).toLowerCase()
        if(!AllowedExtensions.includes(ext)){
            return cb(new Error(`File type ${ext} not allowed. Use CSV or XLSX.` ),false)
        }
        cb(null,true)
    },
    limits :{fileSize :20*1024*1024,files:1}
})
export default upload