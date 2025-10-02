import Fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest} from "fastify";
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
		handler: async(
			request: FastifyRequest<{
				Body: {
					name: string;
					age: number;
				};
			}>,
			reply: FastifyReply
		) => {
			const body = request.body;

			const newUser = await fastify.prisma.user.create({
				data: {
					email: "poirotlegoat@42email.com",
					name: body.name,
					age: body.age,
				},
			});

			return reply.code(201).send(newUser);
		},
	});
}

fastify.register(prismaPlugin);
fastify.register(userRoutes, {prefix: "/api/users"});

async function main() {
	await fastify.listen({
		port: 3000,
		host: "0.0.0.0",
	});
}

main();