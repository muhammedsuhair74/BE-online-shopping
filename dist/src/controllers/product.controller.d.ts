import express from "express";
import ProductService from "../services/product.service.js";
export declare class ProductController {
    private readonly productService;
    router: express.Router;
    constructor(productService: ProductService);
    createProduct(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
    getAllProducts(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
    getProductById(req: express.Request, res: express.Response, next: express.NextFunction): Promise<void>;
}
//# sourceMappingURL=product.controller.d.ts.map