import { PrismaClient } from "@prisma/client";
import type { CreateProjectInput } from "../types/project";

const prisma = new PrismaClient();

export async function getAllProjects() {
  return await prisma.project.findMany();
}

export async function createProject(input: CreateProjectInput) {
  return await prisma.project.create({
    data: {
      name: input.name,
      description: input.description,
    },
  });
}

export async function getProjectById(id: number) {
  return await prisma.project.findUnique({ where: { id } });
}

export async function updateProject(id: number, data: Partial<CreateProjectInput>) {
  return await prisma.project.update({
    where: { id },
    data,
  });
}

export async function deleteProject(id: number) {
  return await prisma.project.delete({ where: { id } });
}
