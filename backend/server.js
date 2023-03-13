const express = require("express");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const multer = require("multer");
const upload = multer({
  dest: "uploads/",
  filename: function (req, file, cb) {
    cb(null, req.body.customname);
  },
});

const { uploadFile, getFileStream } = require("./s3");

const app = express();

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));



app.get("/images/:key", (req, res) => {
  console.log(req.params);
  const key = req.params.key;
  const readStream = getFileStream(key)
  readStream.pipe(res);
});

app.post("/images", upload.single("image"), async (req, res) => {
  const file = req.file;
  const result = await uploadFile(file);
  await unlinkFile(file.path);
  console.log(result);
  const description = req.body.description;
  res.send({ imagePath: `/images/${result.Key}` });
});

app.listen(8080, () => console.log("listening on port 8080"));
