import type ProductRepository from "../repositories/product.repository.js";
import ProductEntity from "../entities/product.entity.js";
declare class ProductService {
    private readonly productRepository;
    constructor(productRepository: ProductRepository);
    createProduct(name: string, description: string, price: number, stock: number, image: string, category: string): Promise<ProductEntity>;
    getAllProducts({ isDeleted, }: {
        isDeleted?: boolean;
    }): Promise<ProductEntity[]>;
    getProductById(id: number): Promise<ProductEntity | null>;
}
export default ProductService;
//# sourceMappingURL=product.service.d.ts.map