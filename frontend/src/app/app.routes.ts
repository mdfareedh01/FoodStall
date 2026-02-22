import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { CartComponent } from './pages/cart/cart.component';
import { adminAuthGuard } from './guards/admin-auth.guard';
import { canDeactivateGuard } from './guards/can-deactivate.guard';

export const routes: Routes = [
    { path: '', component: HomeComponent, data: { animation: 'HomePage' } },
    { path: 'product/:id', component: ProductDetailComponent, data: { animation: 'DetailPage' } },
    { path: 'cart', component: CartComponent, data: { animation: 'CartPage' } },
    {
        path: 'checkout',
        loadComponent: () => import('./pages/checkout/checkout.component').then(m => m.CheckoutComponent),
        data: { animation: 'CheckoutPage' }
    },
    {
        path: 'orders',
        loadComponent: () => import('./pages/orders/orders.component').then(m => m.OrdersComponent)
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/auth/otp-auth.component').then(m => m.OtpAuthComponent)
    },
    {
        path: 'admin/login',
        loadComponent: () => import('./pages/admin/login/admin-login.component').then(m => m.AdminLoginComponent)
    },
    {
        path: 'admin',
        canActivate: [adminAuthGuard],
        children: [
            { path: '', loadComponent: () => import('./pages/admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent) },
            {
                path: 'products',
                loadComponent: () => import('./pages/admin/products/product-list.component').then(m => m.AdminProductListComponent)
            },
            {
                path: 'products/new',
                canDeactivate: [canDeactivateGuard],
                loadComponent: () => import('./pages/admin/products/product-edit.component').then(m => m.AdminProductEditComponent)
            },
            {
                path: 'products/edit/:id',
                canDeactivate: [canDeactivateGuard],
                loadComponent: () => import('./pages/admin/products/product-edit.component').then(m => m.AdminProductEditComponent)
            },
            {
                path: 'orders',
                loadComponent: () => import('./pages/admin/orders/orders.component').then(m => m.AdminOrdersComponent)
            }
        ]
    },
    { path: 'terms', loadComponent: () => import('./pages/legal/legal-page.component').then(m => m.LegalPageComponent), data: { title: 'Terms & Conditions', type: 'terms' } },
    { path: 'privacy', loadComponent: () => import('./pages/legal/legal-page.component').then(m => m.LegalPageComponent), data: { title: 'Privacy Policy', type: 'privacy' } },
    { path: 'shipping', loadComponent: () => import('./pages/legal/legal-page.component').then(m => m.LegalPageComponent), data: { title: 'Shipping Policy', type: 'shipping' } },
    { path: 'cancellation', loadComponent: () => import('./pages/legal/legal-page.component').then(m => m.LegalPageComponent), data: { title: 'Cancellation Policy', type: 'cancellation' } },
    { path: '**', redirectTo: '' }
];
