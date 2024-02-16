import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { DataStoreService } from '../service/data-store.service';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private store: DataStoreService
    ) { }

    canActivate() {
        const currentUser = localStorage.getItem("adminDetails");
        if (currentUser) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login']);
        return false;
    }
}