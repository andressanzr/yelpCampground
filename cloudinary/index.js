const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.QWEYTWQESDAPOQEW,
  api_key: process.env.IUERWUIERIWIEUEWR,
  api_secret: process.env.JKJDSAKDKJAKJEEDA,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "YelpCamp",
    allowedFormats: ["jpeg", "jpg", "png"],
  },
});
module.exports = { cloudinary, storage };
