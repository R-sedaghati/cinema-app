import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";
import { Base } from "./base/base.js";

@Entity({ name: "faq" })
export class FAQ extends Base {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        nullable: false,
        name: 'question'
    })
    question!: string;

    @Column({
        nullable: false,
        name: 'answer'
    })
    answer!: string;
}
