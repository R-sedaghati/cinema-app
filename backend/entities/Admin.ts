import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import * as bcrypt from "bcrypt";
import { Base } from "./base/base.js";
import { AdminRole } from "../utils/enum.js";

@Entity({ name: "admins" })
export class Admin extends Base {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ name: "first_name", nullable: true })
  firstName!: string;

  @Column({ name: "last_name", nullable: true })
  lastName!: string;

  @Column({
    type: "enum",
    enum: AdminRole,
  })
  role!: AdminRole;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (!this.password.startsWith("$2")) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async checkPassword(rawPassword: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, this.password);
  }
}
