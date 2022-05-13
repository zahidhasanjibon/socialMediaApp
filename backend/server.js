const app = require("./app");
const cloudinary = require("cloudinary");

const connectMongodb = require("./config/database");

connectMongodb();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(process.env.PORT, () => {
  console.log(`server listening on port ${process.env.PORT}`);
});
