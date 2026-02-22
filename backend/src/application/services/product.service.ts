import { ProductRepository } from '../../infrastructure/repositories/product.repository.js';
import type { ProductFilter, NewProduct } from '../../domain/entities.js';

export class ProductService {
    constructor(private productRepo: ProductRepository) { }

    async getCatalog(filter?: ProductFilter) {
        return this.productRepo.findAll(filter);
    }

    async getProduct(id: number) {
        return this.productRepo.findById(id);
    }

    async addProduct(product: NewProduct) {
        return this.productRepo.create(product);
    }

    async updateProduct(id: number, product: Partial<NewProduct>) {
        return this.productRepo.update(id, product);
    }

    async removeProduct(id: number) {
        return this.productRepo.softDelete(id);
    }
}
