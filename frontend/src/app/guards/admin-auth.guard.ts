import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { UserStore } from '../store/user.store';

export const adminAuthGuard: CanActivateFn = (route, state) => {
    const userStore = inject(UserStore);
    const router = inject(Router);

    if (userStore.isAdminAuthorized()) {
        return true;
    }

    // Redirect to admin login if not authorized
    return router.parseUrl('/admin/login');
};
