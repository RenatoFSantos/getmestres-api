import { Column, Entity } from "typeorm";
import { BaseEntity } from "./BaseEntity";

@Entity({ name: 'Customer' })
export class Customer extends BaseEntity {

  @Column({ type: 'varchar', length: 200 })
  name: string

  @Column({ type: 'varchar', length: 200 })
  email: string

  @Column({ type: 'varchar', length: 200 })
  photo: string

  @Column({ type: 'varchar', length: 100 })
  phone: string

  @Column({ type: 'varchar', length: 100 })
  password: string

}