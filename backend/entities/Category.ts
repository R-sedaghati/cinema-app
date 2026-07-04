import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
} from "typeorm";
import { Base } from "./base/base.js";
import { ArtistRequest } from "./ArtistRequest.js";
import type { Support } from "./Support.js";

@Entity({ name: "categories" })
export class Category extends Base {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "fa_name" })
  faName!: string;

  @Column({ name: "en_name" })
  enName!: string;

  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "parent_id" })
  parent?: Category | null;

  @OneToMany(() => Category, (category) => category.parent)
  children!: Category[];

  @ManyToMany("ArtistRequest", "categories")
  artistRequests!: ArtistRequest[];

  @OneToMany("Support", "category")
  supports!: Support[];

  @Column({
    type: "jsonb",
    default: {},
  })
  config!: Record<string, any> | null;

  @Column(
    {name: "priority", nullable: true}
  )
  priority?: number
}
