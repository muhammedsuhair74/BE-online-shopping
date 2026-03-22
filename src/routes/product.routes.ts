import dataSource from "../db/data-source.js";
import ProductEntity from "../entities/product.entity.js";
import ProductRepository from "../repositories/product.repository.js";
import ProductService from "../services/product.service.js";
import { ProductController } from "../controllers/product.controller.js";

const productRepository = new ProductRepository(
  dataSource.getRepository(ProductEntity),
);
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);
const productRoutes = productController.router;

export default productRoutes;
