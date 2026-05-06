import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import type { CreateTaskInput } from "../types/task";

const prisma = new PrismaClient();

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export async function getAllTasks() {
  return await prisma.task.findMany();
}

export async function createManyTasks(inputList: CreateTaskInput[]) {
  const created = [];

  for (let i = 0; i < inputList.length; i += 1) {
    const input = inputList[i]!;
    const dueDate = input.dueDate ?? formatDate(new Date(Date.now() + (i + 1) * 24 * 60 * 60 * 1000));

    const task = await prisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        projectId: input.projectId,
        priority: input.priority,
        status: input.status ?? "todo",
        dueDate,
      },
    });

    created.push(task);
  }

  return created;
}

export async function getTaskById(id: number) {
  return await prisma.task.findUnique({ where: { id } });
}

export async function updateTask(id: number, data: Partial<CreateTaskInput>) {
  const patch: Prisma.TaskUpdateInput = {};
  if (data.title !== undefined) {
    patch.title = data.title;
  }
  if (data.description !== undefined) {
    patch.description = data.description;
  }
  if (data.status !== undefined) {
    patch.status = data.status;
  }
  if (data.dueDate !== undefined) {
    patch.dueDate = data.dueDate;
  }
  if (data.priority !== undefined) {
    patch.priority = data.priority;
  }

  return await prisma.task.update({
    where: { id },
    data: patch,
  });
}

export async function deleteTask(id: number) {
  return await prisma.task.delete({ where: { id } });
}
