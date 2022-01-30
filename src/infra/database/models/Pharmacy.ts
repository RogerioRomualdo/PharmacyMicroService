import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";

@Entity("pharmacy")
export class Pharmacy {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  logo: string;

  @Column()
  name: string;

  @Column()
  contact_phone: string;

  @Column()
  document_number: string;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column()
  open_time: string;

  @Column()
  close_time: string;

  @ManyToOne(() => Pharmacy, ({ id }) => id, {
    nullable: true,
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
  })
  is_subsidiary_of: string;
}
