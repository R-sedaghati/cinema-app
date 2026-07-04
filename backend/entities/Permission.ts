import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Base } from "./base/base.js";
import { RolePermission } from "./RolePermission.js";

@Entity()
export class Permission extends Base {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  endpoint!: string;

  @Column()
  method!: string;

  @OneToMany(() => RolePermission, rp => rp.permission)
  rolePermissions!: RolePermission[];
}

