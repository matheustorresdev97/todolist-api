import { prisma } from "@/lib/prisma";
import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export const deleteTask = async (app: FastifyInstance) => {
    app.withTypeProvider<ZodTypeProvider>().delete(
        '/task/:id',
        {
            schema: {
                tags: ['tasks'],
                summary: 'Delete a task',
                params: z.object({
                    id: z.string().uuid()
                }),
                response: {
                    200: z.object({
                        message: z.string()
                    }),
                    400: z.object({ message: z.string() }).describe('Bad request'),
                    404: z.object({ message: z.string() }).describe('Task not found')
                }
            }
        },
        async (request, reply) => {
            const { id } = request.params;
            try {
                await prisma.task.delete({
                    where: { id }
                });
                reply.status(200).send({ message: 'Task deleted successfully' });
            } catch (error) {

                    reply.status(400).send({ message: 'Could not delete task' });
               
            }
        }
    );
};
