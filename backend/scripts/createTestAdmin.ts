import { AppDataSource } from "../config/database.js";
import { Admin } from "../entities/Admin.js";
import { AdminRole } from "../utils/enum.js";

async function run() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const repo = AppDataSource.getRepository(Admin);
    const existing = await repo.findOneBy({ username: "testadmin" });
    if (existing) {
      console.log("Test admin already exists:", { id: existing.id, username: existing.username, email: existing.email });
      process.exit(0);
    }

    const admin = repo.create({
      username: "testadmin",
      email: "testadmin@example.com",
      password: "password123",
      firstName: "Test",
      lastName: "Admin",
      role: AdminRole.SUPER_ADMIN,
    });

    const saved = await repo.save(admin);
    console.log("Created test admin:", { id: saved.id, username: saved.username, email: saved.email });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
