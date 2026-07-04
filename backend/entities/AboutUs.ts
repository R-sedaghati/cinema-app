import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";
import { Base } from "./base/base.js";

@Entity({ name: "about_us" })
export class AboutUs extends Base {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        nullable: false,
        name: 'text'
    })
    text!: string;
}
