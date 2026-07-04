import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";
import { Base } from "./base/base.js";
import { MinioService } from "../services/minio.js";

@Entity({ name: "tutorials" })
export class Tutorial extends Base {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({
        nullable: false,
        name: 'title'
    })
    title!: string;

    @Column({
        nullable: false,
        name: 'content',
        type: 'text',
    })
    content!: string;

    @Column({
        nullable: false,
        name: 'video_url'
    })
    videoUrl!: string;

    @Column({
        nullable: true,
        name: 'thumbnail_path'
    })
    thumbnail?: string | null;

    @Column({
        nullable: false,
        name: 'priority',
        default: 0,
    })
    priority!: number;

    @Column({
        nullable: false,
        name: 'is_main',
        default: false,
    })
    isMain!: boolean;

    async getThumbnailUrl(): Promise<string | null> {
        if (!this.thumbnail) {
            return null;
        }
        const url = await MinioService.getPublicUrls([this.thumbnail]);
        return url[this.thumbnail];
    }
}
