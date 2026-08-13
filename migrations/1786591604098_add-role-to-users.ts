import type {
  ColumnDefinitions,
  MigrationBuilder
} from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(
  pgm: MigrationBuilder
): Promise<void> {
  pgm.addColumn("users", {
    role: {
      type: "varchar(20)",
      notNull: true,
      default: "USER"
    }
  });

  pgm.addConstraint("users", "users_role_check", {
    check: "role IN ('USER', 'ADMIN')"
  });
}

export async function down(
  pgm: MigrationBuilder
): Promise<void> {
  pgm.dropConstraint("users", "users_role_check");
  pgm.dropColumn("users", "role");
}