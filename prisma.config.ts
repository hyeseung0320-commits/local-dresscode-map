import path from "node:path";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
  },
  // 로컬 SQLite 파일 (마이그레이션/CLI용)
  datasource: {
    url: "file:./prisma/dev.db",
  },
});
