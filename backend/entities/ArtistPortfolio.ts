import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { ArtistRequest } from "./ArtistRequest.js";
import { PortfolioType } from "../utils/enum.js";
import { Base } from "./base/base.js";

@Entity({ name: "artist_portfolios" })
export class ArtistPortfolio extends Base {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  filePath!: string;

  @Column({
    type: "enum",
    enum: PortfolioType,
  })
  type!: PortfolioType;

  @ManyToOne("ArtistRequest", "portfolios", {
    nullable: false,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "artist_request_id" })
  artistRequest!: ArtistRequest;
}
