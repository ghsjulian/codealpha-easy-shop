const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const getString = () => {
  const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
  return "product---" + randomNumber.toString();
};

// 🔹 Upload Function
const Uploader = async (imgPath) => {
  try {
    const results = await cloudinary.uploader.upload(imgPath, {
      folder: "codealpha-assets",
      public_id: getString(),
    });
    return results;
  } catch (error) {
    console.log("Error in Uploader -", error);
    throw error;
  }
};

// 🔹 Delete Function
const Destroyer = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Deleted from Cloudinary:", result);
    return result;
  } catch (error) {
    console.log("Error in DeleteFile -", error);
    throw error;
  }
};




module.exports = { Uploader, Destroyer };
