import fastifyCors from "@fastify/cors";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { fastify } from "fastify";
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from "fastify-type-provider-zod";

import { errorHandler } from "./errors";

import { createTask } from "@/routes/create-task";
import { updateTask } from "@/routes/update-task";
import { deleteTask } from "@/routes/delete-task";
import { getAllTasks } from "@/routes/get-tasks";

export const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    openapi: "3.0.0",
    info: {
      title: "Todo List",
      description:
        "Especificações da API para o back-end da aplicação todo list.",
      version: "1.0.0",
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
});

app.register(fastifyCors, {
  origin: "*",
  credentials: true,
});

app.setErrorHandler(errorHandler);

app.register(createTask)
app.register(updateTask)
app.register(deleteTask)
app.register(getAllTasks)
