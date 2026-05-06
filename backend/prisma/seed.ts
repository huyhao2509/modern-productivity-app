import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();

  const project1 = await prisma.project.create({
    data: {
      name: "Personal Productivity Hub",
      description: "Track daily tasks, notes, and focus sessions in one place.",
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: "Team Sprint Board",
      description: "Plan and monitor sprint backlog, progress, and priorities.",
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: "Learning Roadmap",
      description: "Organize weekly learning goals and milestone checklists.",
    },
  });

  await prisma.task.create({
    data: {
      title: "Set up backend structure",
      description: "Initialize Express app and core middleware for API development.",
      status: "done",
      dueDate: "2026-04-10",
      projectId: project1.id,
      priority: "high",
    },
  });

  await prisma.task.create({
    data: {
      title: "Build projects API",
      description: "Create project endpoints and return hard-coded demo data.",
      status: "in_progress",
      dueDate: "2026-04-12",
      projectId: project2.id,
      priority: "medium",
    },
  });

  await prisma.task.create({
    data: {
      title: "Design tasks page UI",
      description: "Draft responsive task cards and loading/error states in frontend.",
      status: "todo",
      dueDate: "2026-04-15",
      projectId: project3.id,
      priority: "medium",
    },
  });

  await prisma.task.create({
    data: {
      title: "Write API integration notes",
      description: "Document endpoint contracts for frontend consumption.",
      status: "todo",
      dueDate: "2026-04-18",
      projectId: project1.id,
      priority: "low",
    },
  });

  console.log("Seeding complete");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
