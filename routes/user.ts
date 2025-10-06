import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";

export async function userRoutes(fastify: FastifyInstance) {
	fastify.post("/", {
		schema: {
			body: {
				type: "object",
				required: ["username", "email"],
				properties: {
					username: { type: "string", minLength: 3 },
					email: { type: "string", format: "email" },
				},
			},
		},
		handler: async (
			request: FastifyRequest<{
				Body: {
					username: string;
					email: string;
				};
			}>,
			reply: FastifyReply,
		) => {
			const body = request.body;

			try {
				const newUser = await fastify.prisma.user.create({
					data: {
						username: body.username,
						email: body.email,
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