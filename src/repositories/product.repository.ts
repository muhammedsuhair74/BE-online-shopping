import { IsNull, Not, type Repository } from "typeorm";
import ProductEntity from "../entities/product.entity.js";

class ProductRepository {
  constructor(private readonly productRepository: Repository<ProductEntity>) { }

  async createProduct(
    name: string,
    description: string,
    price: number,
    stock: number,
    image: string,
    category: string,
  ): Promise<ProductEntity> {
    try {
      return await this.productRepository.save({
        name,
        description,
        price,
        stock,
        image,
        category,
      });
    } catch (error) {
      throw error;
    }
  }

  async getAllProducts({
    isDeleted,
  }: {
    isDeleted?: boolean;
  }): Promise<ProductEntity[]> {
    // TypeORM already excludes soft-deleted rows by default; avoid extra
    // `deletedAt: IsNull()` in where — it can conflict with that filter.
    try {
      if (isDeleted) {
        return await this.productRepository.find({
          where: { deletedAt: Not(IsNull()) },
          withDeleted: true,
        });
      }
      else {
        return await this.productRepository.find({
          where: { deletedAt: IsNull() },
          withDeleted: false,
        });
      }
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id: number): Promise<ProductEntity | null> {
    try {
      return await this.productRepository.findOne({
        where: { id },
        withDeleted: false,
      });
    } catch (error) {
      throw error;
    }
  }
}

export default ProductRepository;
