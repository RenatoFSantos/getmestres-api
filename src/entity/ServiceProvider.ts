import { Column, Entity } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity({ name: 'ServiceProvider' })
export class ServiceProvider extends BaseEntity {
  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column({ type: 'varchar', length: 200 })
  photo: string;

  @Column({ type: 'varchar', length: 200 })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 3000, nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 1000, nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  addressComplement: string;

  @Column({ type: 'varchar', length: 2 })
  state: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 8 })
  zipCode: string;

  @Column({ type: 'varchar', length: 3000 })
  citiesCare: string;

  @Column({ type: 'varchar', length: 3000 })
  categoriesCare: string;

  @Column({ type: 'varchar', length: 50 })
  phone: string;

}