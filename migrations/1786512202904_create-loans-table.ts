import type {
  ColumnDefinitions,
  MigrationBuilder
} from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(
  pgm: MigrationBuilder
): Promise<void> {
  pgm.createTable("loans", {
    id: {
      type: "serial",
      primaryKey: true
    },

    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "RESTRICT"
    },

    book_id: {
      type: "integer",
      notNull: true,
      references: "books",
      onDelete: "RESTRICT"
    },

    loaned_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP")
    },

    due_at: {
      type: "timestamp",
      notNull: true
    },

    returned_at: {
      type: "timestamp",
      notNull: false
    }
  });

  pgm.createIndex(
    "loans",
    "book_id",
    {
      name: "loans_one_active_per_book",
      unique: true,
      where: "returned_at IS NULL"
    }
  );
}

export async function down(
  pgm: MigrationBuilder
): Promise<void> {
  pgm.dropTable("loans");
}
