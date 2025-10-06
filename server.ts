import Fastify, { type FastifyInstance, type FastifyReply, type FastifyRequest } from "fastify";
// @ts-ignore
import { PrismaClient } from "./generated/prisma";
import prismaPlugin from "./plugins/prismaPlugin.ts";
import { userRoutes } from "./routes/user.ts";

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

fastify.register(prismaPlugin);
fastify.register(userRoutes, { prefix: "/api/users" });

async function main() {
	await fastify.listen({
		port: 3000,
		host: "0.0.0.0",
	});
}

main();
