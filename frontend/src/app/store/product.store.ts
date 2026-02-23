import { signalStore, withState, withMethods, withComputed, patchState, withHooks } from '@ngrx/signals';
import { computed, inject, effect } from '@angular/core';
import { MockDataService, Product } from '../services/mock-data.service';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap, of } from 'rxjs';

type ProductState = {
    products: Product[];
    loading: boolean;
    error: string | null;
    selectedProductId: number | null;
};

const initialState: ProductState = {
    products: [],
    loading: false,
    error: null,
    selectedProductId: null,
};

export const ProductStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed(({ products, selectedProductId }) => ({
        vegProducts: computed(() => products().filter(p => p.isVeg)),
        nonVegProducts: computed(() => products().filter(p => !p.isVeg)),
        selectedProduct: computed(() =>
            products().find(p => p.id === selectedProductId()) || null
        )
    })),
    withMethods((store, productService = inject(MockDataService)) => {
        const loadProducts = rxMethod<void>(
            pipe(
                tap(() => patchState(store, { loading: true })),
                switchMap(() => productService.getProducts().pipe(
                    tap((products) => patchState(store, { products, loading: false })),
                    tap({ error: (err) => patchState(store, { error: err.message, loading: false }) })
                ))
            )
        );

        return {
            loadProducts,
            selectProduct(id: number | null) {
                patchState(store, { selectedProductId: id });
            },
            addProduct: rxMethod<{ product: Omit<Product, 'id'> }>(
                pipe(
                    tap(() => patchState(store, { loading: true, error: null })),
                    switchMap(({ product }) => productService.addProduct(product).pipe(
                        tap((newProduct) => patchState(store, {
                            products: [...store.products(), newProduct],
                            loading: false
                        })),
                        tap({ error: (err) => patchState(store, { error: err.message || 'Failed to add product', loading: false }) })
                    ))
                )
            ),
            updateProduct: rxMethod<{ product: Product }>(
                pipe(
                    tap(() => patchState(store, { loading: true, error: null })),
                    switchMap(({ product }) => productService.updateProduct(product.id, product).pipe(
                        tap((updated) => patchState(store, {
                            products: store.products().map(p => p.id === updated.id ? updated : p),
                            loading: false
                        })),
                        tap({ error: (err) => patchState(store, { error: err.message || 'Failed to update product', loading: false }) })
                    ))
                )
            ),
            deleteProduct: rxMethod<number>(
                pipe(
                    switchMap((id) => productService.deleteProduct(id).pipe(
                        tap(() => patchState(store, {
                            products: store.products().filter(p => p.id !== id)
                        }))
                    ))
                )
            )
        };
    }),
    withHooks({
        onInit(store) {
            store.loadProducts();
        },
    })
);
