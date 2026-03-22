import { IsNull, Not } from "typeorm";
import ProductEntity from "../entities/product.entity.js";
class ProductRepository {
    productRepository;
    constructor(productRepository) {
        this.productRepository = productRepository;
    }
    async createProduct(name, description, price, stock, image, category) {
        try {
            return await this.productRepository.save({
                name,
                description,
                price,
                stock,
                image,
                category,
            });
        }
        catch (error) {
            throw error;
        }
    }
    async getAllProducts({ isDeleted, }) {
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
        }
        catch (error) {
            throw error;
        }
    }
    async getProductById(id) {
        try {
            return await this.productRepository.findOne({
                where: { id },
                withDeleted: false,
            });
        }
        catch (error) {
            throw error;
        }
    }
}
export default ProductRepository;
//# sourceMappingURL=product.repository.js.map