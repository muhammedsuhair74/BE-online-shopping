import ProductEntity from "../entities/product.entity.js";
class ProductService {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async createProduct(name, description, price, stock, image, category) {
        return this.productRepository.createProduct(name, description, price, stock, image, category);
    }
    async getAllProducts({ isDeleted, }) {
        // Empty list is valid — do not throw (was breaking GET /product with no rows).
        return this.productRepository.getAllProducts({
            isDeleted: isDeleted ?? false,
        });
    }
    async getProductById(id) {
        const product = await this.productRepository.getProductById(id);
        if (!product) {
            throw new Error("Product not found");
        }
        return product;
    }
}
export default ProductService;
//# sourceMappingURL=product.service.js.map