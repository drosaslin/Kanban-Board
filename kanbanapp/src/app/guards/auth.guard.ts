import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        public afAuth: AngularFireAuth
    ) {}

    public canActivate(): Observable<boolean> {
        return this.afAuth.authState.map(auth => {
            if (!auth) {
                this.router.navigate(['']);
                return false;
            }

            return true;
        });
    }
}
