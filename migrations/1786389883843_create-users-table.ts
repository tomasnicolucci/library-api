import type { MigrationBuilder } from "node-pg-migrate";

export const up = (pgm: MigrationBuilder) => {
  pgm.createTable("users", {
    id: {
      type: "serial",
      primaryKey: true
    },
    name: {
      type: "varchar(100)",
      notNull: true
    },
    email: {
      type: "varchar(255)",
      notNull: true,
      unique: true
    },
    password_hash: {
      type: "varchar(255)",
      notNull: true
    }
  });
};

export const down = (pgm: MigrationBuilder) => {
  pgm.dropTable("users");
};