import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Base } from "./base/base.js";
import { AdminRole } from "../utils/enum.js";
import { Permission } from "./Permission.js";

@Entity()
export class RolePermission extends Base {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "enum",
    enum: AdminRole,
  })
  role!: AdminRole;

  @ManyToOne(() => Permission, permission => permission.rolePermissions, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "permission_id" })
  permission!: Permission;
}