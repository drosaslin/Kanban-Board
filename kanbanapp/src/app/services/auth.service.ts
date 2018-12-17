import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public afAuth: AngularFireAuth) { }

  login(email: string, password: string) {
    return new Promise((_resolve, _reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then(userData => _resolve(userData),
        err => _reject(err));
    });
  }

  getUserStatus() {
    return this.afAuth.authState.map(auth => auth);
  }
}
