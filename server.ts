import Fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from "fastify";
import { PrismaClient } from "./generated/prisma";
import prismaPlugin from "./plugins/prismaPlugin.ts";

declare module "fastify" {
	interface FastifyInstance {
		prisma: PrismaClient;
	}
}

const fastify = Fastify({
	logger: {
		transport: {
			target: "pino-pretty",
		},
	},
});

async function userRoutes(fastify: FastifyInstance) {
	fastify.post("/", {
		schema: {
			body: {
				type: "object",
				required: ["name", "email"],
				properties: {
					name: { type: "string", minLength: 3 },
					email: { type: "string", format: "email" },
				},
			},
		},
		handler: async (
			request: FastifyRequest<{
				Body: {
					name: string;
					email: string;
				};
			}>,
			reply: FastifyReply,
		) => {
			const body = request.body;

			try {
				const newUser = await fastify.prisma.user.create({
					data: {
						email: body.email,
						name: body.name,
					},
				});

				return reply.code(201).send(newUser);
			} catch (error: any) {
				if (error.code === "P2002") {
					return reply.code(409).send({
						statusCode: 409,
						error: "Conflict",
						message: "An User already exists with that email address",
					});
				}

				throw error;
			}
		},
	});
}

fastify.register(prismaPlugin);
fastify.register(userRoutes, { prefix: "/api/users" });

async function main() {
	await fastify.listen({
		port: 3000,
		host: "0.0.0.0",
	});
}

main();
