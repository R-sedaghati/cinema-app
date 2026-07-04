import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
} from "typeorm";
import { Base } from "./base/base.js";
import { ArtistPortfolio } from "./ArtistPortfolio.js";
import { ArtistRequestStatus } from "../utils/enum.js";
import { Payment } from "./Payment.js";
import { Category } from "./Category.js";

@Entity({ name: "artist_requests" })
export class ArtistRequest extends Base {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne("User", "artistRequests", {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "user_id" })
  user!: any;

  @ManyToMany(() => Category, (category) => category.artistRequests, {
    cascade: false,
  })
  @JoinTable({
    name: "artist_request_categories",
    joinColumn: {
      name: "artist_request_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "category_id",
      referencedColumnName: "id",
    },
  })
  categories!: Category[];

  @OneToMany("ArtistPortfolio", "artistRequest")
  portfolios!: ArtistPortfolio[];

  @Column({
    type: "enum",
    enum: ArtistRequestStatus,
    default: ArtistRequestStatus.PENDING,
  })
  status!: ArtistRequestStatus;

  @OneToMany(() => Payment, (payment) => payment.artistRequest)
  payments!: Payment[];

  @Column({
    name: 'tracking_code',
    unique: true,
    nullable: true,
  })
  trackingCode?: string;

  @OneToMany("ArtistRequestRejectedReason", "artistRequest")
  rejectedReasons!: ArtistRequestRejectedReason[];

  @BeforeInsert()
  generateTrackingCode() {
    this.trackingCode = this.generateUniqueCode();
  }

  private generateUniqueCode(): string {
    const timestamp = Date.now().toString(); // 13 digits
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0'); // 3 digits
    return (timestamp + random).slice(0, 12); // 12 digit code like 471487419346
  }
}

@Entity({ name: "artist_requests_rejected_reasons" })
export class ArtistRequestRejectedReason extends Base {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne("ArtistRequest", "rejectedReasons", {
    onDelete: "CASCADE",
    nullable: false,
  })
  @JoinColumn({ name: "artist_request_id" })
  artistRequest!: ArtistRequest;

  @Column()
  reason!: string;
}