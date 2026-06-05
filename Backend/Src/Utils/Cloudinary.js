import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config({path:'./.env'})
cloudinary.config({ 
  cloud_name:process.env.CLOUD_NAME, 
  api_key:process.env.CLOUD_API_KEY, 
  api_secret:process.env.CLOUD_SECRET
});


const uploadonCloudinary = async (localfilepath) => {
    try {
        if(!localfilepath) return null
     const response= await cloudinary.uploader.upload(localfilepath,{
            resource_type:'auto'
        })
        fs.unlinkSync(localfilepath);
        return response.secure_url;
    } catch (error) {
        console.error("Cloudinary Upload Error:", error.message);
        fs.unlinkSync(localfilepath)
        return null
    }
}

export {uploadonCloudinary}