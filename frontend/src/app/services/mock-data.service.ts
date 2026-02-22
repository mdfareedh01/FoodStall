import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Product {
    id: number;
    title: string;
    image: string;
    price: number;
    isVeg: boolean;
    ingredients: string[];
    description: string;
    category?: string;
    isSpecial?: boolean;
    origin?: 'Farm' | 'Homemade' | 'Standard';
    tags?: string[];
}

export interface CartItem {
    product: Product;
    quantity: number;
}

export interface Order {
    id: string;
    customerPhone: string;
    createdAt: Date;
    items?: CartItem[];
    total: number;
    status: 'pending' | 'completed' | 'cancelled';
}

@Injectable({
    providedIn: 'root'
})
export class MockDataService {
    private apiUrl = environment.apiUrl + '/products';

    constructor(private http: HttpClient) { }

    private mapProduct(raw: any): Product {
        return {
            ...raw,
            ingredients: Array.isArray(raw.ingredients) ? raw.ingredients :
                (typeof raw.ingredients === 'string' ? JSON.parse(raw.ingredients) : []),
            tags: Array.isArray(raw.tags) ? raw.tags :
                (typeof raw.tags === 'string' ? JSON.parse(raw.tags) : [])
        };
    }

    getProducts(filter?: { category?: string, isSpecial?: boolean, origin?: string, search?: string }): Observable<Product[]> {
        let params = new HttpParams();
        if (filter?.category) params = params.set('category', filter.category);
        if (filter?.isSpecial !== undefined) params = params.set('isSpecial', filter.isSpecial.toString());
        if (filter?.origin) params = params.set('origin', filter.origin);
        if (filter?.search) params = params.set('search', filter.search);

        return this.http.get<any[]>(this.apiUrl, { params }).pipe(
            map(items => items.map(item => this.mapProduct(item)))
        );
    }

    getProductById(id: number): Observable<Product | undefined> {
        return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
            map(item => this.mapProduct(item))
        );
    }

    // CRUD operations for Admin
    private adminUrl = environment.apiUrl + '/admin/products';
    private adminOrderUrl = environment.apiUrl + '/admin/orders';

    addProduct(product: Partial<Product>): Observable<Product> {
        return this.http.post<any>(this.adminUrl, product).pipe(
            map(item => this.mapProduct(item))
        );
    }

    updateProduct(id: number, product: Partial<Product>): Observable<Product> {
        return this.http.put<any>(`${this.adminUrl}/${id}`, product).pipe(
            map(item => this.mapProduct(item))
        );
    }

    deleteProduct(id: number): Observable<any> {
        return this.http.delete(`${this.adminUrl}/${id}`);
    }

    // Admin Order APIs
    getAdminOrders(): Observable<Order[]> {
        return this.http.get<any[]>(this.adminOrderUrl).pipe(
            map(orders => orders.map(order => this.mapOrder(order)))
        );
    }

    updateOrderStatus(orderId: string, status: 'pending' | 'completed' | 'cancelled'): Observable<Order> {
        return this.http.patch<any>(`${this.adminOrderUrl}/${orderId}/status`, { status }).pipe(
            map(order => this.mapOrder(order))
        );
    }

    // Order API
    private orderUrl = environment.apiUrl + '/orders';

    getOrders(phone?: string): Observable<Order[]> {
        let params = new HttpParams();
        if (phone) params = params.set('phone', phone);

        return this.http.get<any[]>(`${this.orderUrl}/me`, { params }).pipe(
            map(orders => orders.map(order => this.mapOrder(order)))
        );
    }

    placeOrder(request: { customerPhone: string, items: { productId: number, quantity: number }[] }): Observable<Order> {
        console.log('[MockDataService] POST /api/orders request:', request);
        return this.http.post<any>(this.orderUrl, request).pipe(
            tap(res => console.log('[MockDataService] POST /api/orders response raw:', res)),
            map(order => this.mapOrder(order)),
            tap(order => console.log('[MockDataService] POST /api/orders mapped:', order))
        );
    }

    private mapOrder(raw: any): Order {
        return {
            ...raw,
            createdAt: new Date(raw.createdAt),
            items: raw.items?.map((item: any) => ({
                ...item,
                product: this.mapProduct(item.product)
            }))
        };
    }
}
