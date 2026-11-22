"use server";

import { redirect } from "next/navigation";
import { updateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { tags } from "@/lib/cache-tags";
import { projectSchema, toFieldErrors } from "@/lib/validations";

export type ProjectFormState =
  | {
      success?: boolean;
      error?: string;
      fieldErrors?: Record<string, string[]>;
      values?: { name?: string; description?: string };
    }
  | undefined;

function readValues(formData: FormData) {
  return {
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
}

export async function createProject(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const userId = await requireUserId();
  const values = readValues(formData);

  const parsed = projectSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error.issues), values };
  }
  const { name, description } = parsed.data;

  await prisma.project.create({
    data: { name, description: description || null, ownerId: userId },
  });

  updateTag(tags.projects(userId));
  return { success: true };
}

export async function updateProject(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const userId = await requireUserId();
  const projectId = String(formData.get("projectId") ?? "");
  const values = readValues(formData);

  const parsed = projectSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error.issues), values };
  }
  const { name, description } = parsed.data;

  const result = await prisma.project.updateMany({
    where: { id: projectId, ownerId: userId },
    data: { name, description: description || null },
  });
  if (result.count === 0) {
    return { error: "Project not found", values };
  }

  updateTag(tags.projects(userId));
  return { success: true };
}

export async function deleteProject(
  _prev: ProjectFormState,
  formData: FormData,
): Promise<ProjectFormState> {
  const userId = await requireUserId();
  const projectId = String(formData.get("projectId") ?? "");

  const result = await prisma.project.deleteMany({
    where: { id: projectId, ownerId: userId },
  });
  if (result.count === 0) {
    return { error: "Project not found" };
  }

  updateTag(tags.projects(userId));
  redirect("/projects");
}
