import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Pharmacy } from "./Pharmacy";

@Entity("pharmacyProducts")
export class PharmacyProducts {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @ManyToOne(() => Pharmacy, ({ pharmacyProducts }) => pharmacyProducts, {
    onDelete: "CASCADE",
  })
  pharmacy: Pharmacy;

  @Column()
  productId: string;

  @Column()
  unitsInStock: number;
}
