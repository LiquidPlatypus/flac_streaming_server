import Fastify from 'fastify';

const fastify = Fastify({
	logger: {
		transport: {
			target: "pino-pretty",
		},
	},
});

async function userRoutes(fastify) {
	fastify.post("/", {
		schema: {
			body: {
				type: 'object',
				required: ['name', 'email'],
				properties: {
					name: { type: 'string' },
					email: { type: 'string', format: 'email' },
					age: { type: 'number', minimum: 0 },
				}
			}
		},

		handler: async(request, reply) => {
			const body = request.body;
			console.log(body);

			return reply.code(201).send("User created");
		},
	});
}

fastify.register(userRoutes, {prefix: "/api/users"});

async function main() {
	await fastify.listen({
		port: 3000,
		host: "0.0.0.0",
	});
}

main();