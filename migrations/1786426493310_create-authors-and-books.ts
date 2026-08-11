import type { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("authors", {
    id: {
      type: "serial",
      primaryKey: true
    },
    name: {
      type: "varchar(100)",
      notNull: true
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP")
    }
  });

  pgm.createTable("books", {
    id: {
      type: "serial",
      primaryKey: true
    },
    title: {
      type: "varchar(200)",
      notNull: true
    },
    isbn: {
      type: "varchar(20)",
      notNull: true,
      unique: true
    },
    published_year: {
      type: "integer",
      notNull: true
    },
    author_id: {
      type: "integer",
      notNull: true,
      references: "authors",
      onDelete: "RESTRICT"
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP")
    },
    updated_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP")
    }
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("books");
  pgm.dropTable("authors");
}
