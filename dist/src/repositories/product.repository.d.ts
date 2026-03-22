import { type Repository } from "typeorm";
import ProductEntity from "../entities/product.entity.js";
declare class ProductRepository {
    private readonly productRepository;
    constructor(productRepository: Repository<ProductEntity>);
    createProduct(name: string, description: string, price: number, stock: number, image: string, category: string): Promise<ProductEntity>;
    getAllProducts({ isDeleted, }: {
        isDeleted?: boolean;
    }): Promise<ProductEntity[]>;
    getProductById(id: number): Promise<ProductEntity | null>;
}
export default ProductRepository;
//# sourceMappingURL=product.repository.d.ts.map