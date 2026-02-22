import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { effect } from '@angular/core';

export type UserRole = 'USER' | 'ADMIN';

type UserState = {
    user: { phoneNumber: string; role: UserRole } | null;
    token: string | null;
    status: 'idle' | 'requesting' | 'verifying' | 'error';
    error: string | null;
    isAdminAuthorized: boolean;
};

const initialState: UserState = {
    user: JSON.parse(localStorage.getItem('atoz_user') || 'null'),
    token: localStorage.getItem('atoz_token'),
    status: 'idle',
    error: null,
    isAdminAuthorized: localStorage.getItem('atoz_admin_authorized') === 'true',
};

export const UserStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store) => {
        effect(() => {
            if (store.user()) {
                localStorage.setItem('atoz_user', JSON.stringify(store.user()));
            } else {
                localStorage.removeItem('atoz_user');
            }

            if (store.token()) {
                localStorage.setItem('atoz_token', store.token()!);
            } else {
                localStorage.removeItem('atoz_token');
            }

            localStorage.setItem('atoz_admin_authorized', String(store.isAdminAuthorized()));
        });

        return {
            requestOtp(phoneNumber: string) {
                patchState(store, { status: 'requesting', error: null });
                setTimeout(() => {
                    console.log(`[Dev] OTP requested for ${phoneNumber}`);
                    patchState(store, { status: 'idle' });
                }, 1000);
            },
            verifyOtp(phoneNumber: string, otp: string) {
                patchState(store, { status: 'verifying', error: null });
                setTimeout(() => {
                    if (otp === '123456') {
                        const role: UserRole = phoneNumber === '9999999999' ? 'ADMIN' : 'USER';
                        patchState(store, {
                            user: { phoneNumber, role },
                            token: 'mock-jwt-token',
                            status: 'idle',
                        });
                    } else {
                        patchState(store, { status: 'error', error: 'Invalid OTP' });
                    }
                }, 1000);
            },
            verifyAdminPassword(password: string): boolean {
                if (password === 'Admin@123') {
                    patchState(store, { isAdminAuthorized: true });
                    return true;
                }
                return false;
            },
            logout() {
                patchState(store, { user: null, token: null, isAdminAuthorized: false });
            },
        };
    })
);
