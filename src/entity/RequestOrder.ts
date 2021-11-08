import { SubCategory } from './SubCategory';
import { Entity, Column, ManyToOne } from "typeorm";
import { BaseEntity } from "./BaseEntity";
import { Customer } from "./Customer";
import { RequestStatus } from "./enum/RequestStatus";
import { ServiceProvider } from "./ServiceProvider";

@Entity({ name: 'RequestOrder' })
export class RequestOrder extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  longlat: string;

  @Column({ type: 'varchar', length: 200 })
  title: string

  @Column({ type: 'varchar', length: 2000 })
  description: string;

  @Column()
  statusOrder: RequestStatus;

  @ManyToOne(() => SubCategory, { eager: true })
  subCategory: SubCategory;

  @ManyToOne(() => Customer, { eager: true })
  customer: Customer

  @ManyToOne(() => ServiceProvider, { eager: true, nullable: true })
  serviceProvider: ServiceProvider

}