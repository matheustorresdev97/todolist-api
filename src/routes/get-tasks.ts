import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export const getAllTasks = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/tasks",
    {
      schema: {
        tags: ["tasks"],
        summary: "Get all tasks",
        response: {
          200: z.array(
            z.object({
              id: z.string(),
              task_description: z.string(),
              created_at: z.string(),
              updated_at: z.string(),
              is_completed: z.boolean(),
            })
          ),
          400: z
            .object({ message: z.string() })
            .describe("Error retrieving tasks"),
        },
      },
    },
    async (request, reply) => {
      try {
        const tasks = await prisma.task.findMany();
        reply.status(200).send(
          tasks.map((task) => ({
            id: task.id,
            task_description: task.task_description,
            created_at: task.created_at.toISOString(),
            updated_at: task.updated_at.toISOString(),
            is_completed: task.is_completed,
          }))
        );
      } catch (error) {
        reply.status(400).send({ message: "Error retrieving tasks" });
      }
    }
  );
};
