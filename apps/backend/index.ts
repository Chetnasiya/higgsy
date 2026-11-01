import express from "express";
import path from "node:path";
import { prisma } from "./db";
import { CreateAvatarSchenma, CreateUserSchema, CreateVideoSchema } from "./types";
import { generateVideo } from "./video";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use("/output", express.static(path.join(process.cwd(), "output")));

// Auth
app.post("/api/v1/signup", async (req, res) => {
  const parsed = CreateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(411).json({
      message: "Username must be at least 2 characters and password at least 6 characters.",
    });
  }

  const existing = await prisma.user.findUnique({
    where: { username: parsed.data.username },
  });

  if (existing) {
    return res.status(409).json({
      message: "Username is already taken.",
    });
  }

  const user = await prisma.user.create({
    data: {
      username: parsed.data.username,
      password: parsed.data.password,
    },
  });

  return res.json({ id: user.id, username: user.username });
});

app.post("/api/v1/signin", async (req, res) => {
  const parsed = CreateUserSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Username and password are required.",
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      username: parsed.data.username,
    },
  });

  if (!user || user.password !== parsed.data.password) {
    return res.status(401).json({
      message: "Invalid username or password.",
    });
  }

  return res.json({ id: user.id, username: user.username });
});

// Avatar
app.post("/api/v1/avatar", async (req, res) => {
  const parsed = CreateAvatarSchenma.safeParse(req.body);
  if (!parsed.success) {
    return res.status(411).json({
      message: "Please provide a valid avatar name and image.",
    });
  }

  const userId = parsed.data.userId ?? "1";
  const userExists = await prisma.user.findUnique({ where: { id: userId } });
  if (!userExists) {
    return res.status(404).json({
      message: "User not found.",
    });
  }

  const avatar = await prisma.avatar.create({
    data: {
      userId,
      name: parsed.data.name,
    },
  });

  return res.json({ id: avatar.id, name: avatar.name, userId: avatar.userId });
});

app.get("/api/v1/avatar/:avatarId", async (req, res) => {
  const avatar = await prisma.avatar.findUnique({
    where: { id: req.params.avatarId },
  });

  if (!avatar) {
    return res.status(404).json({ message: "Avatar not found." });
  }

  return res.json({ avatar });
});

app.get("/api/v1/avatars", async (req, res) => {
  const userId = typeof req.query.userId === "string" ? req.query.userId : "1";

  const avatars = await prisma.avatar.findMany({
    where: {
      userId,
    },
    orderBy: {
      id: "desc",
    },
  });

  res.json({ avatars });
});

// Video
app.post("/api/v1/video", async (req, res) => {
  const parsed = CreateVideoSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      message: "Please provide a valid prompt and reference images.",
    });
  }

  const imageUrls = parsed.data.imageUrls.length
    ? parsed.data.imageUrls
    : [
        "https://raw.githubusercontent.com/100xdevs-bootcamp-1/higgsy/refs/heads/main/apps/backend/assets/09578560-870f-4b23-a1cb-b549aa38a23f.png",
        "https://raw.githubusercontent.com/100xdevs-bootcamp-1/higgsy/refs/heads/main/apps/backend/assets/a9d55f96-bc90-45e6-b078-7593b8bc3b11.png",
        "https://raw.githubusercontent.com/100xdevs-bootcamp-1/higgsy/refs/heads/main/apps/backend/assets/8106a04c-bed5-4ac4-94ef-970c5aee1518.png",
      ];

  const outputPath = path.join(process.cwd(), "output", `video-${Date.now()}.mp4`);

  try {
    await generateVideo(parsed.data.prompt, imageUrls, outputPath);
    return res.json({
      success: true,
      prompt: parsed.data.prompt,
      videoUrl: `/output/${path.basename(outputPath)}`,
    });
  } catch (error) {
    console.error("Video generation failed:", error);
    return res.status(500).json({
      message: "Video generation failed. Please try again.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

app.get("/api/v1/video/:videoId", (req, res) => {
  const filePath = path.join(process.cwd(), "output", req.params.videoId);
  return res.sendFile(filePath, (error) => {
    if (error) {
      res.status(404).json({ message: "Video not found." });
    }
  });
});

app.get("/api/v1/videos", async (req, res) => {
  const userId = typeof req.query.userId === "string" ? req.query.userId : "1";
  const videos = await prisma.avatarVideo.findMany({
    where: { userId },
    orderBy: { id: "desc" },
  });
  res.json({ videos });
});

// User
app.get("/api/v1/me", (req, res) => {
  res.json({});
});

// Models
app.get("/api/v1/models", (req, res) => {
  res.json({});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
