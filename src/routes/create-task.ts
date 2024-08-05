import z from "zod";
import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export const createTask = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/task",
    {
      schema: {
        tags: ["tasks"],
        summary: "Create a new task",
        body: z.object({
          task_description: z.string().min(4),
          is_completed: z.boolean().optional().default(false),
        }),
        response: {
          201: z.object({
            id: z.string(),
            task_description: z.string(),
            created_at: z.string(),
            updated_at: z.string(),
            is_completed: z.boolean(),
          }),
          400: z.object({ message: z.string() }).describe("Bad request"),
        },
      },
    },
    async (request, reply) => {
      const { task_description, is_completed } = request.body;
      try {
        const newTask = await prisma.task.create({
          data: {
            task_description,
            is_completed,
          },
        });
        reply.status(201).send({
          id: newTask.id,
          task_description: newTask.task_description,
          created_at: newTask.created_at.toISOString(),
          updated_at: newTask.updated_at.toISOString(),
          is_completed: newTask.is_completed,
        });
      } catch (error) {
        reply.status(400).send({ message: "Não foi possível criar a tarefa" });
      }
    }
  );
};
