import type ProductRepository from "../repositories/product.repository.js";
import ProductEntity from "../entities/product.entity.js";

class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(
    name: string,
    description: string,
    price: number,
    stock: number,
    image: string,
    category: string,
  ): Promise<ProductEntity> {
    return this.productRepository.createProduct(
      name,
      description,
      price,
      stock,
      image,
      category,
    );
  }
  async getAllProducts({
    isDeleted,
  }: {
    isDeleted?: boolean;
  }): Promise<ProductEntity[]> {
    // Empty list is valid — do not throw (was breaking GET /product with no rows).
    return this.productRepository.getAllProducts({
      isDeleted: isDeleted ?? false,
    });
  }
  async getProductById(id: number): Promise<ProductEntity | null> {
    const product = await this.productRepository.getProductById(id);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }
}

export default ProductService;
