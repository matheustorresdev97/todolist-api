import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "@/lib/prisma";

export const updateTask = async (app: FastifyInstance) => {
  app.withTypeProvider<ZodTypeProvider>().patch(
    "/task/:id",
    {
      schema: {
        tags: ["tasks"],
        summary: "Update task completion status",
        params: z.object({
          id: z.string().uuid(),
        }),
        body: z.object({
          is_completed: z.boolean(),
        }),
        response: {
          200: z.object({
            id: z.string(),
            task_description: z.string(),
            created_at: z.string(),
            updated_at: z.string(),
            is_completed: z.boolean(),
          }),
          400: z.object({ message: z.string() }).describe("Bad request"),
          404: z.object({ message: z.string() }).describe("Task not found"),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { is_completed } = request.body;
      try {
        const updatedTask = await prisma.task.update({
          where: { id },
          data: { is_completed },
        });
        reply.status(200).send({
          id: updatedTask.id,
          task_description: updatedTask.task_description,
          created_at: updatedTask.created_at.toISOString(),
          updated_at: updatedTask.updated_at.toISOString(),
          is_completed: updatedTask.is_completed,
        });
      } catch (error) {
        reply.status(400).send({ message: "Could not update task" });
      }
    }
  );
};
