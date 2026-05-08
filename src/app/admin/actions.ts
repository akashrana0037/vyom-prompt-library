"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import fs from "fs/promises";
import path from "path";

const ADMIN_ID = process.env.ADMIN_ID || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "vyom_studio_2024";

export async function login(formData: FormData) {
  const id = formData.get("id");
  const password = formData.get("password");

  if (id === ADMIN_ID && password === ADMIN_PASSWORD) {
    const cookieStore = await cookies();
    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });
    return { success: true };
  }

  return { success: false, error: "Invalid credentials" };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
  redirect("/admin");
}

export async function addPrompt(formData: FormData) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (!session || session.value !== "true") {
    throw new Error("Unauthorized");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const prompt = formData.get("prompt") as string;
  const category = formData.get("category") as string;
  const imageUrls = (formData.get("imageUrls") as string).split(",").map(url => url.trim()).filter(url => url);

  if (!title || !prompt || !category) {
    return { success: false, error: "Missing required fields" };
  }

  const filePath = path.join(process.cwd(), "src", "data", "prompts.json");
  const fileData = await fs.readFile(filePath, "utf-8");
  const prompts = JSON.parse(fileData);

  // Generate a new ID (numeric or string)
  const lastId = prompts.length > 0 ? prompts[prompts.length - 1].id : 0;
  const newId = typeof lastId === "number" ? lastId + 1 : `mg_${Date.now()}`;

  const newEntry = {
    id: newId,
    title,
    description,
    prompt,
    category,
    images: imageUrls,
    createdAt: new Date().toISOString()
  };

  prompts.push(newEntry);

  await fs.writeFile(filePath, JSON.stringify(prompts, null, 2));

  return { success: true };
}
