export const swaggerDocument = {
  openapi: "3.0.3",

  info: {
    title: "Library Management API",
    version: "1.0.0",
    description:
      "REST API for managing users, authors, books and library loans."
  },

  servers: [
    {
      url: "http://localhost:3000"
    }
  ],

  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT"
      }
    },

    schemas: {
      RegisterInput: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: {
            type: "string",
            example: "Alice"
          },
          email: {
            type: "string",
            format: "email",
            example: "alice@example.com"
          },
          password: {
            type: "string",
            example: "12345678"
          }
        }
      },

      LoginInput: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: {
            type: "string",
            format: "email",
            example: "alice@example.com"
          },
          password: {
            type: "string",
            example: "12345678"
          }
        }
      },

      CreateAuthorInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: {
            type: "string",
            example: "George Orwell"
          }
        }
      },

      BookInput: {
        type: "object",
        required: [
          "title",
          "isbn",
          "publishedYear",
          "authorId"
        ],
        properties: {
          title: {
            type: "string",
            example: "1984"
          },
          isbn: {
            type: "string",
            example: "9780451524935"
          },
          publishedYear: {
            type: "integer",
            example: 1949
          },
          authorId: {
            type: "integer",
            example: 1
          }
        }
      },

      CreateLoanInput: {
        type: "object",
        required: ["bookId", "dueAt"],
        properties: {
          bookId: {
            type: "integer",
            example: 1
          },
          dueAt: {
            type: "string",
            format: "date-time",
            example: "2026-08-30T18:00:00.000Z"
          }
        }
      },

      RefreshTokenInput: {
        type: "object",
        required: ["refreshToken"],
        properties: {
          refreshToken: {
            type: "string"
          }
        }
      }
    }
  },

  paths: {
    "/health": {
        get: {
        tags: ["Health"],
        summary: "Check API status",
        responses: {
            "200": {
            description: "API is running"
            }
        }
        }
    },

    "/auth/register": {
        post: {
        tags: ["Auth"],
        summary: "Register a new user",
        requestBody: {
            required: true,
            content: {
            "application/json": {
                schema: {
                $ref: "#/components/schemas/RegisterInput"
                }
            }
            }
        },
        responses: {
            "201": {
            description: "User registered"
            },
            "400": {
            description: "Validation error"
            },
            "409": {
            description: "Email already registered"
            }
        }
        }
    },

    "/auth/login": {
        post: {
        tags: ["Auth"],
        summary: "Login and obtain access and refresh tokens",
        requestBody: {
            required: true,
            content: {
            "application/json": {
                schema: {
                $ref: "#/components/schemas/LoginInput"
                }
            }
            }
        },
        responses: {
            "200": {
            description: "Authentication successful"
            },
            "401": {
            description: "Invalid email or password"
            }
        }
        }
    },

    "/auth/refresh": {
        post: {
        tags: ["Auth"],
        summary: "Rotate refresh token and generate new tokens",
        requestBody: {
            required: true,
            content: {
            "application/json": {
                schema: {
                $ref: "#/components/schemas/RefreshTokenInput"
                }
            }
            }
        },
        responses: {
            "200": {
            description: "New tokens generated"
            },
            "401": {
            description: "Invalid or expired refresh token"
            }
        }
        }
    },

    "/auth/logout": {
        post: {
        tags: ["Auth"],
        summary: "Revoke a refresh token",
        requestBody: {
            required: true,
            content: {
            "application/json": {
                schema: {
                $ref: "#/components/schemas/RefreshTokenInput"
                }
            }
            }
        },
        responses: {
            "204": {
            description: "Logout successful"
            }
        }
        }
    },

    "/auth/me": {
        get: {
        tags: ["Auth"],
        summary: "Get authenticated user information",
        security: [
            {
            bearerAuth: []
            }
        ],
        responses: {
            "200": {
            description: "Authenticated user"
            },
            "401": {
            description: "Authentication required"
            }
        }
        }
    },

    "/authors": {
        get: {
        tags: ["Authors"],
        summary: "List all authors",
        security: [
            {
            bearerAuth: []
            }
        ],
        responses: {
            "200": {
            description: "Authors list"
            }
        }
        },

        post: {
        tags: ["Authors"],
        summary: "Create an author",
        security: [
            {
            bearerAuth: []
            }
        ],
        requestBody: {
            required: true,
            content: {
            "application/json": {
                schema: {
                $ref: "#/components/schemas/CreateAuthorInput"
                }
            }
            }
        },
        responses: {
            "201": {
            description: "Author created"
            },
            "403": {
            description: "Admin role required"
            }
        }
        }
    },

    "/authors/{id}": {
        get: {
        tags: ["Authors"],
        summary: "Get an author and their books",
        security: [
            {
            bearerAuth: []
            }
        ],
        parameters: [
            {
            name: "id",
            in: "path",
            required: true,
            schema: {
                type: "integer"
            }
            }
        ],
        responses: {
            "200": {
            description: "Author found"
            },
            "404": {
            description: "Author not found"
            }
        }
        }
    },

    "/books": {
        get: {
        tags: ["Books"],
        summary: "List, search, paginate and sort books",
        security: [
            {
            bearerAuth: []
            }
        ],
        parameters: [
            {
            name: "search",
            in: "query",
            required: false,
            description: "Search by book title or author name",
            schema: {
                type: "string"
            }
            },
            {
            name: "page",
            in: "query",
            required: false,
            schema: {
                type: "integer",
                default: 1,
                minimum: 1
            }
            },
            {
            name: "limit",
            in: "query",
            required: false,
            schema: {
                type: "integer",
                default: 10,
                minimum: 1,
                maximum: 100
            }
            },
            {
            name: "sort",
            in: "query",
            required: false,
            schema: {
                type: "string",
                enum: ["title", "publishedYear", "createdAt"],
                default: "title"
            }
            },
            {
            name: "order",
            in: "query",
            required: false,
            schema: {
                type: "string",
                enum: ["asc", "desc"],
                default: "asc"
            }
            }
        ],
        responses: {
            "200": {
            description: "Books list"
            }
        }
        },

        post: {
        tags: ["Books"],
        summary: "Create a book",
        security: [
            {
            bearerAuth: []
            }
        ],
        requestBody: {
            required: true,
            content: {
            "application/json": {
                schema: {
                $ref: "#/components/schemas/BookInput"
                }
            }
            }
        },
        responses: {
            "201": {
            description: "Book created"
            },
            "403": {
            description: "Admin role required"
            },
            "404": {
            description: "Author not found"
            }
        }
        }
    },

    "/books/{id}": {
        get: {
        tags: ["Books"],
        summary: "Get a book by ID",
        security: [
            {
            bearerAuth: []
            }
        ],
        parameters: [
            {
            name: "id",
            in: "path",
            required: true,
            schema: {
                type: "integer"
            }
            }
        ],
        responses: {
            "200": {
            description: "Book found"
            },
            "404": {
            description: "Book not found"
            }
        }
        },

        put: {
        tags: ["Books"],
        summary: "Replace editable book fields",
        security: [
            {
            bearerAuth: []
            }
        ],
        parameters: [
            {
            name: "id",
            in: "path",
            required: true,
            schema: {
                type: "integer"
            }
            }
        ],
        requestBody: {
            required: true,
            content: {
            "application/json": {
                schema: {
                $ref: "#/components/schemas/BookInput"
                }
            }
            }
        },
        responses: {
            "200": {
            description: "Book updated"
            },
            "403": {
            description: "Admin role required"
            },
            "404": {
            description: "Book or author not found"
            }
        }
        },

        patch: {
        tags: ["Books"],
        summary: "Update selected book fields",
        security: [
            {
            bearerAuth: []
            }
        ],
        parameters: [
            {
            name: "id",
            in: "path",
            required: true,
            schema: {
                type: "integer"
            }
            }
        ],
        requestBody: {
            required: true,
            content: {
            "application/json": {
                schema: {
                type: "object",
                minProperties: 1,
                properties: {
                    title: {
                    type: "string"
                    },
                    isbn: {
                    type: "string"
                    },
                    publishedYear: {
                    type: "integer"
                    },
                    authorId: {
                    type: "integer"
                    }
                }
                }
            }
            }
        },
        responses: {
            "200": {
            description: "Book partially updated"
            },
            "400": {
            description: "No fields supplied or invalid data"
            },
            "403": {
            description: "Admin role required"
            },
            "404": {
            description: "Book or author not found"
            }
        }
        },

        delete: {
        tags: ["Books"],
        summary: "Delete a book",
        security: [
            {
            bearerAuth: []
            }
        ],
        parameters: [
            {
            name: "id",
            in: "path",
            required: true,
            schema: {
                type: "integer"
            }
            }
        ],
        responses: {
            "204": {
            description: "Book deleted"
            },
            "403": {
            description: "Admin role required"
            },
            "404": {
            description: "Book not found"
            }
        }
        }
    },

    "/loans": {
        get: {
        tags: ["Loans"],
        summary: "Get the authenticated user's loans",
        security: [
            {
            bearerAuth: []
            }
        ],
        responses: {
            "200": {
            description: "User loan history"
            }
        }
        },

        post: {
        tags: ["Loans"],
        summary: "Borrow a book",
        security: [
            {
            bearerAuth: []
            }
        ],
        requestBody: {
            required: true,
            content: {
            "application/json": {
                schema: {
                $ref: "#/components/schemas/CreateLoanInput"
                }
            }
            }
        },
        responses: {
            "201": {
            description: "Loan created"
            },
            "404": {
            description: "Book not found"
            },
            "409": {
            description: "Book already has an active loan"
            }
        }
        }
    },

    "/loans/all": {
        get: {
        tags: ["Loans"],
        summary: "Get all loans",
        description: "Admin only",
        security: [
            {
            bearerAuth: []
            }
        ],
        responses: {
            "200": {
            description: "All loans"
            },
            "403": {
            description: "Admin role required"
            }
        }
        }
    },

    "/loans/active": {
        get: {
        tags: ["Loans"],
        summary: "Get all active loans",
        description: "Admin only. Returns loans where returnedAt is null.",
        security: [
            {
            bearerAuth: []
            }
        ],
        responses: {
            "200": {
            description: "Active loans"
            },
            "403": {
            description: "Admin role required"
            }
        }
        }
    },

    "/loans/{id}": {
        get: {
        tags: ["Loans"],
        summary: "Get one of the authenticated user's loans",
        security: [
            {
            bearerAuth: []
            }
        ],
        parameters: [
            {
            name: "id",
            in: "path",
            required: true,
            schema: {
                type: "integer"
            }
            }
        ],
        responses: {
            "200": {
            description: "Loan found"
            },
            "404": {
            description: "Loan not found"
            }
        }
        }
    },

    "/loans/{id}/return": {
        post: {
        tags: ["Loans"],
        summary: "Return a borrowed book",
        security: [
            {
            bearerAuth: []
            }
        ],
        parameters: [
            {
            name: "id",
            in: "path",
            required: true,
            schema: {
                type: "integer"
            }
            }
        ],
        responses: {
            "200": {
            description: "Book returned"
            },
            "404": {
            description: "Loan not found"
            },
            "409": {
            description: "Loan has already been returned"
            }
        }
        }
    }
    }
};