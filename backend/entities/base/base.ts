import { Entity, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, Column } from 'typeorm';
import { AppDataSource } from '../../config/database.js';

@Entity({ name: 'base' })
export class Base {
  @CreateDateColumn({ name: "created_at" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt!: Date;

  @DeleteDateColumn({ name: "deleted_at" })
  deletedAt?: Date | null;

  @Column({
    name: "is_active",
    default: true,
  })
  isActive!: boolean;

  async softDelete() {
    if (this.isActive) {
      const repo = await AppDataSource.getRepository(this.constructor as typeof Base);
      this.isActive = false
      await repo.softRemove(this as any)
    }
  }
}