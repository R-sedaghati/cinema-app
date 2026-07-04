import { Entity, PrimaryGeneratedColumn, Column, OneToMany, BeforeInsert } from "typeorm";
import { Base } from "./base/base.js";
import { MinioService } from "../services/minio.js";
import { Gender, SkinColor } from "../utils/enum.js";
import { AppDataSource } from "../config/database.js";

@Entity({ name: "users" })
export class User extends Base {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  phone_number!: string;

  @Column({ nullable: true, name: "first_name" })
  firstName?: string;

  @Column({ nullable: true, name: "last_name" })
  lastName?: string;

  @Column({ nullable: true, name: "last_login" })
  lastLogin?: Date;

  @OneToMany("ArtistRequest", "user")
  artistRequests!: any[];

  @Column({ nullable: true, name: "avatar_path" })
  avatar?: string;

  @Column({
    type: "enum",
    enum: Gender,
    nullable: true,
  })
  gender?: Gender;

  @Column({ type: "date", nullable: true, name: "birthday" })
  birthDate?: Date;

  @Column({nullable: true, name: "height"})
  height?: number;

  @Column({nullable: true, name: "weight"})
  weight?: number;

  @Column({nullable:true , name: "language"})
  language?: string;

  @Column({nullable: true, name: "dialect"})
  dialect?: string;

  @Column({nullable: true, name: "email"})
  email?: string;

  @Column({nullable: true, name: "address"})
  address?: string;

  @Column({nullable: true, name: "province"})
  province?: string;

  @Column({nullable: true, name: "city"})
  city?: string;

  @Column({nullable: true, name: "postal_code"})
  postalCode?: string;

  @Column({nullable: true, name: "education"})
  education?: string;

  @Column({nullable: true, name: "major"})
  major?: string;
  
  @Column({nullable: true, name: "about_me"})
  aboutMe?: string

  @Column({
    type: "enum",
    enum: SkinColor,
    nullable: true,
  })
  skinColor?: SkinColor;

  @Column({
    name: 'code',
    unique: true,
    nullable: true,
    default: () => "nextval('user_code_seq')",
  })
  code?: string;

  async getAvatarUrl(): Promise<string | null> {
    if (!this.avatar) {
      return null;
    }
    const url = await MinioService.getPublicUrls([this.avatar])
    return url[0];
  }
}
