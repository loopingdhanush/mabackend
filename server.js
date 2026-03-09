const express = require("express");
const axios = require("axios");
const cors = require("cors");
const dotenv = require("dotenv");
const admin = require("firebase-admin");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// temporary memory store for taskId -> prompt
const taskPromptMap = {};

// firebase service key
const serviceAccount = require("./ai-fashion-57f19-firebase-adminsdk-fbsvc-5a6515820e.json");

// initialize firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// verify firebase user
async function verifyUser(req, res, next) {

  const token = req.headers.authorization?.split("Bearer ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  try {

    const decoded = await admin.auth().verifyIdToken(token);
    req.user = decoded;

    next();

  } catch (err) {

    res.status(401).json({ error: "Invalid token" });

  }

}

// get AI queue status
app.get("/queue", async (req, res) => {

  try {

    console.log("Fetching queue");

    const response = await axios.get(
      `${process.env.AI_SERVER}/queue`
    );

    res.json(response.data);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Queue unavailable" });

  }

});

// generate images from prompts
app.post("/generate", verifyUser, async (req, res) => {

  try {

    const { prompts } = req.body;

    if (!prompts || prompts.length === 0) {
      return res.status(400).json({ error: "No prompts provided" });
    }

    const tasks = [];

    for (const prompt of prompts) {

      const ai = await axios.post(
        `${process.env.AI_SERVER}/generate`,
        { prompt }
      );

      const taskId = ai.data.task_id;

      // store prompt temporarily
      taskPromptMap[taskId] = prompt;

      tasks.push({ taskId });

    }

    res.json({ tasks });

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Generation request failed" });

  }

});

// check result of generated image
app.get("/result/:taskId", verifyUser, async (req, res) => {

  try {

    const taskId = req.params.taskId;

    const ai = await axios.get(
      `${process.env.AI_SERVER}/result/${taskId}`,
      {
        responseType: "arraybuffer",
        validateStatus: false
      }
    );

    // if image is ready
    if (ai.headers["content-type"] === "image/png") {

      const filename = `temp_${Date.now()}.png`;

      fs.writeFileSync(filename, ai.data);

      const upload = await cloudinary.uploader.upload(filename, {
        folder: `users/${req.user.uid}`,
      });

      fs.unlinkSync(filename);

      const prompt = taskPromptMap[taskId] || "unknown";

      await db.collection("designs").add({
        uid: req.user.uid,
        prompt: prompt,
        imageUrl: upload.secure_url,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // remove prompt from memory
      delete taskPromptMap[taskId];

      return res.json({
        status: "done",
        imageUrl: upload.secure_url,
        prompt
      });

    }

    // still processing
    return res.json({ status: "processing" });

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Result fetch failed" });

  }

});

// fetch user designs
app.get("/my-designs", verifyUser, async (req, res) => {
  try {

    console.log("Viewing designs");

    const snapshot = await db
      .collection("designs")
      .where("uid", "==", req.user.uid)
      .orderBy("createdAt", "desc")
      .limit(5)
      .get();

    const designs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.json(designs);

  } catch (err) {

    console.error(err);
    res.status(500).json({ error: "Failed to fetch designs" });

  }
});

// start server
app.listen(process.env.PORT, () => {
  console.log("Backend running on port", process.env.PORT);
});