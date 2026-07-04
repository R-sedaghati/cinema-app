import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { Base } from "./base/base.js";
import { Category } from "./Category.js";
import { SupportStatus } from "../utils/enum.js";

@Entity({ name: "supports" })
export class Support extends Base {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: "first_name" })
  firstName!: string;

  @Column({ name: "last_name" })
  lastName!: string;

  @Column({ name: "email" })
  email!: string;

  @Column({ name: "subject" })
  subject!: string;

  @Column({ name: "message" })
  message!: string

  @ManyToOne(() => Category, {
    nullable: true,
    onDelete: "SET NULL",
  })
  @JoinColumn({ name: "category_id" })
  category?: Category;

  @Column({
      type: "enum",
      enum: SupportStatus,
      default: SupportStatus.PENDING,
    })
    status!: SupportStatus;

  @Column({ name: "phone_number", nullable: true })
  phoneNumber?: string
}
