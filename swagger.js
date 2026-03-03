const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Vulnerable NoSQL CRUD API Lab",
      version: "1.0.0",
      description:
        "Intentionally vulnerable NoSQL CRUD API lab for demonstrating injection attacks. Native v1 uses Mongoose, v2 uses MongoDB native driver."
    },
    servers: [
      {
        url: "/",
        description: 'Development server'
      },
    ],
    components: {
      schemas: {
        api: {
        }
      },
      responses: {
        200: {
          description: 'API',
          contents: 'application/json'
        },
        400: {
          description: 'Malformed Token has been presented - Provide Valid Token',
          contents: 'application/json'
        },
        401: {
          description: 'Token has expired - Provide a fresh one',
          contents: 'application/json'
        },
        403: {
          description: 'Missing Bearer Token - add it to the Authorization header',
          contents: 'application/json'
        },
        404: {
          description: 'Not found - not found',
          contents: 'application/json'
        }
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    },
    security: [{
      bearerAuth: []
    }]

  },
  apis: ["./routes/*.js"],
}

module.exports = options