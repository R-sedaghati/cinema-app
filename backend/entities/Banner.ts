import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";
import { Base } from "./base/base.js";
import { MinioService } from "../services/minio.js";

@Entity({ name: "banners" })
export class Banner extends Base {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        nullable: false,
        name: 'title'
    })
    title!: string;

    @Column({
        nullable: false,
        name: 'subtitle'
    })
    subtitle!: string;

    @Column({
        nullable: false,
        name: 'image_path'
    })
    image!: string;

    @Column({
        nullable: false,
        name: 'cta_label'
    })
    ctaLabel!: string;

    @Column({
        nullable: false,
        name: 'cta_link'
    })
    ctaLink!: string;

    @Column({
        nullable: false,
        name: 'priority',
        default: 0,
    })
    priority!: number;

    async getImageUrl(): Promise<string | null> {
        if (!this.image) {
            return null;
        }
        const url = await MinioService.getPublicUrls([this.image]);
        return url[this.image];
    }
}
