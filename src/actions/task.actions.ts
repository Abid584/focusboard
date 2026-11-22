"use server";

import { z } from "zod";
import { updateTag } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUserId } from "@/lib/session";
import { tags } from "@/lib/cache-tags";
import { TASK_STATUSES, type TaskStatusValue } from "@/lib/constants";
import { taskSchema, toFieldErrors } from "@/lib/validations";

export type TaskFormState =
  | {
      success?: boolean;
      error?: string;
      fieldErrors?: Record<string, string[]>;
      values?: {
        title?: string;
        description?: string;
        status?: string;
        priority?: string;
        dueDate?: string;
      };
    }
  | undefined;

function readValues(formData: FormData) {
  return {
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    status: String(formData.get("status") ?? "TODO"),
    priority: String(formData.get("priority") ?? "MEDIUM"),
    dueDate: String(formData.get("dueDate") ?? ""),
  };
}

async function nextPosition(projectId: string, status: TaskStatusValue) {
  const result = await prisma.task.aggregate({
    where: { projectId, status },
    _max: { position: true },
  });
  return (result._max.position ?? -1) + 1;
}

async function findOwnedTask(userId: string, taskId: string) {
  return prisma.task.findFirst({
    where: { id: taskId, project: { ownerId: userId } },
    select: { id: true, projectId: true, status: true },
  });
}

function invalidate(userId: string, projectId: string) {
  updateTag(tags.tasks(projectId));
  updateTag(tags.projects(userId)); // the task count on the project list changes
}

export async function createTask(
  _prev: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  const userId = await requireUserId();
  const projectId = String(formData.get("projectId") ?? "");
  const values = readValues(formData);

  const parsed = taskSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error.issues), values };
  }

  const project = await prisma.project.findFirst({
    where: { id: projectId, ownerId: userId },
    select: { id: true },
  });
  if (!project) return { error: "Project not found", values };

  const { title, description, status, priority, dueDate } = parsed.data;

  await prisma.task.create({
    data: {
      title,
      description: description || null,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      position: await nextPosition(projectId, status),
      projectId,
    },
  });

  invalidate(userId, projectId);
  return { success: true };
}

export async function updateTask(
  _prev: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  const userId = await requireUserId();
  const taskId = String(formData.get("taskId") ?? "");
  const values = readValues(formData);

  const parsed = taskSchema.safeParse(values);
  if (!parsed.success) {
    return { fieldErrors: toFieldErrors(parsed.error.issues), values };
  }

  const task = await findOwnedTask(userId, taskId);
  if (!task) return { error: "Task not found", values };

  const { title, description, status, priority, dueDate } = parsed.data;
  const position =
    status !== task.status
      ? await nextPosition(task.projectId, status)
      : undefined;

  await prisma.task.update({
    where: { id: task.id },
    data: {
      title,
      description: description || null,
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate) : null,
      position,
    },
  });

  invalidate(userId, task.projectId);
  return { success: true };
}

export async function moveTask(
  taskId: string,
  status: string,
): Promise<{ error?: string }> {
  const userId = await requireUserId();

  const parsed = z.enum(TASK_STATUSES).safeParse(status);
  if (!parsed.success) return { error: "Invalid status" };

  const task = await findOwnedTask(userId, taskId);
  if (!task) return { error: "Task not found" };
  if (task.status === parsed.data) return {};

  await prisma.task.update({
    where: { id: task.id },
    data: {
      status: parsed.data,
      position: await nextPosition(task.projectId, parsed.data),
    },
  });

  invalidate(userId, task.projectId);
  return {};
}

export async function deleteTask(
  _prev: TaskFormState,
  formData: FormData,
): Promise<TaskFormState> {
  const userId = await requireUserId();
  const taskId = String(formData.get("taskId") ?? "");

  const task = await findOwnedTask(userId, taskId);
  if (!task) return { error: "Task not found" };

  await prisma.task.delete({ where: { id: task.id } });

  invalidate(userId, task.projectId);
  return { success: true };
}
