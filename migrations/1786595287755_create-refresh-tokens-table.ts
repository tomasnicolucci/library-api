import type {
  ColumnDefinitions,
  MigrationBuilder
} from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(
  pgm: MigrationBuilder
): Promise<void> {
  pgm.createTable("refresh_tokens", {
    id: {
      type: "serial",
      primaryKey: true
    },

    user_id: {
      type: "integer",
      notNull: true,
      references: "users",
      onDelete: "CASCADE"
    },

    token_hash: {
      type: "varchar(64)",
      notNull: true,
      unique: true
    },

    expires_at: {
      type: "timestamp",
      notNull: true
    },

    revoked_at: {
      type: "timestamp",
      notNull: false
    },

    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("CURRENT_TIMESTAMP")
    }
  });

  pgm.createIndex("refresh_tokens", "user_id");
}

export async function down(
  pgm: MigrationBuilder
): Promise<void> {
  pgm.dropTable("refresh_tokens");
}
