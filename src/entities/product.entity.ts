import { Column, Entity } from "typeorm";
import AbstractEntity from "./abstract.entity.js";

@Entity()
class Product extends AbstractEntity {
  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column()
  stock: number;

  @Column()
  image: string;

  @Column()
  category: string;
}

export default Product;
