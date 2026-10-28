import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

export async function createImage(userPrompt: string, imageUrl: string, outputFilePath: string) {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new Error("GOOGLE_API_KEY is required for image generation.");
    }

    const sourceImage = await axios.get<ArrayBuffer>(imageUrl, {
      responseType: "arraybuffer",
    });
    const contentType = sourceImage.headers["content-type"];
    const mimeType = (typeof contentType === "string" ? contentType.split(";")[0] : undefined) ?? "image/png";
    if (!mimeType.startsWith("image/")) {
      throw new Error(`The image URL returned an unsupported content type: ${mimeType}`);
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: "gemini-3.1-flash-image",
      contents: [
        { text: userPrompt },
        {
          inlineData: {
            mimeType,
            data: Buffer.from(sourceImage.data).toString("base64"),
          },
        },
      ],
    });

    const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData?.data);
    if (!imagePart?.inlineData?.data) {
      throw new Error("The image generation response did not contain an image.");
    }

    await mkdir(path.dirname(outputFilePath), { recursive: true });
    await writeFile(outputFilePath, Buffer.from(imagePart.inlineData.data, "base64"));
}