import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { PharmacyProducts } from "./PharmacyProducts";

@Entity("pharmacy")
export class Pharmacy {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  logo: string;

  @Column()
  name: string;

  @Column()
  contactPhone: string;

  @Column()
  documentNumber: string;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column()
  openTime: string;

  @Column()
  closeTime: string;

  @ManyToOne(() => Pharmacy, ({ id }) => id, {
    nullable: true,
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  isSubsidiaryOf?: string;

  @OneToMany(() => PharmacyProducts, ({ pharmacy }) => pharmacy, {
    cascade: true,
  })
  pharmacyProducts: PharmacyProducts[];
}
