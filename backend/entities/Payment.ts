import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { PaymentStatus } from "../utils/enum.js";

@Entity({ name: "payments" })
export class Payment {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ type: "float" })
    amount!: number;

    @Column({ type: "varchar" })
    paymentGateway!: string;

    @Column({ type: "varchar" })
    paymentId!: string;

    @ManyToOne("ArtistRequest", "payments", {
      nullable: false,
      onDelete: "CASCADE"
    })
    @JoinColumn({ name: "artist_request_id" })
    artistRequest!: any;

    @Column({
        type: "enum",
        enum: PaymentStatus,
        default: PaymentStatus.PENDING
    })
    status!: PaymentStatus;
}