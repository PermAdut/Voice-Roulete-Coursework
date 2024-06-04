const express = require("express");
const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");
const multer = require("multer");
const crypto = require("crypto");
const path = require("path");
const config = require("config");
const fs = require("fs");
const { error } = require("console");

const router = express.Router();

mongoose
  .connect(config.get("dbUrl"))
  .then(() => console.log("MongoDB подключено"))
  .catch((err) => console.error("MongoDB ошибка подключения:", err));

let gfsBucket;
const conn = mongoose.connection;
conn.once("open", () => {
  gfsBucket = new GridFSBucket(conn.db, {
    bucketName: "recordings",
  });
});

const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    crypto.randomBytes(16, (err, buf) => {
      if (err) {
        return cb(err);
      }
      const filename = buf.toString("hex") + path.extname(file.originalname);
      cb(null, filename);
    });
  },
});

const upload = multer({ storage });

router.post("/upload_recording", upload.single("audioFile"), (req, res) => {
  if (!req.file) {
    console.error("Файл не загружен");
    return res.status(500).json({ error: "Ошибка при загрузке файла" });
  }

  const userId = req.body.userId;
  console.log("Metadata:", { userId });

  if (!gfsBucket) {
    console.error("GridFSBucket не инициализирован");
    return res.status(500).json({ error: "GridFSBucket не инициализирован" });
  }

  const writestream = gfsBucket.openUploadStream(req.file.originalname, {
    contentType: req.file.mimetype,
    metadata: {
      originalname: req.file.originalname,
      userId: userId,
    },
  });

  const readstream = fs.createReadStream(`./uploads/${req.file.filename}`);
  readstream.pipe(writestream);

  writestream.on("finish", (file) => {
    console.log("File successfully saved to GridFS");
    fs.unlink(`./uploads/${req.file.filename}`, (err) => {
      if (err) {
        console.error("Ошибка при удалении временного файла:", err);
      }
    });
    res.json({ file });
  });

  writestream.on("error", (err) => {
    console.error("Ошибка при сохранении файла в GridFS:", err);
    res.status(500).json({ error: "Ошибка при сохранении файла в GridFS" });
  });
});

router.get("/get_recordings/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: "userId не найден" });
    }
    const files = await mongoose.connection.db
      .collection("recordings.files")
      .find({ "metadata.userId": userId })
      .toArray();

    if (!files.length) {
      return res.status(404).json({ error: "Записи не найдены" });
    }

    res.json(files);
  } catch (e) {
    console.error("Ошибка при получении записей:", error);
    res.status(500).json({ error: "Ошибка при получении записей" });
  }
});

router.get("/download/:recordingId", async (req, res) => {
  try {
    const recordingId = req.params.recordingId;
    console.log(recordingId);
    if (!recordingId) {
      return res.status(400).json({ error: "Невозможно найти запись" });
    }
    const file = await gfsBucket
      .find({ _id: new mongoose.Types.ObjectId(recordingId) })
      .toArray();
    if (!file[0] || file.length === 0) {
      return res.status(404).json({ error: "Запись не найдена" });
    }
    res.setHeader("Content-Type", file[0].contentType);
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + file[0].filename
    );
    const downloadStream = gfsBucket.openDownloadStream(file[0]._id);

    downloadStream.on("data", (chunk) => {
      res.write(chunk);
    });

    downloadStream.on("error", () => {
      res.sendStatus(404);
    });

    downloadStream.on("end", () => {
      res.end();
    });
  } catch (e) {
    console.error("Ошибка при получении записей:", e);
    res.status(500).json({ error: "Ошибка при получении записей" });
  }
});

module.exports = router;
