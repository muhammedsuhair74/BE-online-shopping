import express from "express";
import ProductService from "../services/product.service.js";
import ProductEntity from "../entities/product.entity.js";

export class ProductController {
  router: express.Router;

  constructor(private readonly productService: ProductService) {
    this.router = express.Router();
    this.router.post("/", this.createProduct.bind(this));
    this.router.get("/", this.getAllProducts.bind(this));
    this.router.get("/:id", this.getProductById.bind(this));
  }

  async createProduct(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    try {
      const { name, description, price, stock, image, category } = req.body;
      const product = await this.productService.createProduct(
        name,
        description,
        price,
        stock,
        image,
        category,
      );
      res.status(201).json(product);
    } catch (error) {
      next(error);
    }
  }

  async getAllProducts(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    try {
      const { isDeleted } = req.query;
      let products: ProductEntity[];
      if (isDeleted && isDeleted === "true") {
        products = await this.productService.getAllProducts({
          isDeleted: true,
        });
      } else {
        products = await this.productService.getAllProducts({
          isDeleted: false,
        });
      }
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  }

  async getProductById(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;
      const parsedId = Number(id);
      if (!Number.isInteger(parsedId) || parsedId <= 0) {
        throw new Error("Invalid product id");
      }
      const product = await this.productService.getProductById(parsedId);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  }
}
