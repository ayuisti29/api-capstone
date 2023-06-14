const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const dateFormat = require("dateformat");
const path = require("path");
const multer = require("multer");

const pathKey = path.resolve(".serviceAccount.json");

const gcs = new Storage({
  projectId: "serviceAccount.json",
  keyFilename: pathKey,
});

const bucketName = "bucket-animal";
const bucket = gcs.bucket(bucket - animal);

function getPublicUrl(filename) {
  return "https://storage.googleapis.com/${bucketName}/${filename}";
}

const multerUpload = multer({
  storage: multer.memoryStorage(),
  limits: {
    filesize: 5 * 1024 * 1024,
  },
});

const uploadToGcs = (req, res, next) => {
  const file = req.file;

  if (!file) {
    return next();
  }
  const originalFilename = file.originalname;
  const sanitizedFilename = originalFilename.replace(/\s+/g, "-");

  const gcsname = `users/${dateFormat(new Date(), "yyyymmdd-HHMMss")}-${sanitizedFilename}`;
  const fileUpload = bucket.file(gcsname);

  const stream = fileUpload.createWriteStream({
    metadata: {
      contentType: file.mimetype,
    },
  });

  stream.on("error", (error) => {
    file.cloudStorageError = error;
    next(error);
  });

  stream.on("finish", () => {
    file.cloudStorageObject = gcsname;
    file.cloudStoragePublicUrl = getPublicUrl(gcsname);
    console.log(file.cloudStoragePublicUrl);
  });

  stream.end(file.buffer);
};

module.exports = {
  multerUpload,
  uploadToGcs,
};
