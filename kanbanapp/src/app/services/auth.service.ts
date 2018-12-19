import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FormGroup, FormControl, Validators } from '../../../node_modules/@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userList: AngularFireList<any>;
  form = new FormGroup({
    $key: new FormControl(null),
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    password1: new FormControl('', Validators.minLength(6)),
    password2: new FormControl('', Validators.minLength(6))
  });

  constructor(public afAuth: AngularFireAuth, private db: AngularFireDatabase) { }

  // Firebase login authentication
  public login(email: string, password: string) {
    return new Promise((_resolve, _reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then(userData => _resolve(userData),
          err => _reject(err));
    });
  }

  getUsers() {
    this.userList = this.db.list('users');
    return this.userList.snapshotChanges();
  }

  // Creates an account
  public signup(firstName, lastName, email, username, password) {
    this.userList.push({
      firstName: firstName,
      lastName: lastName,
      email: email,
      username: username,
      password: password
    });
  }

  // Checks user status
  public getUserStatus() {
  return this.afAuth.authState.map(auth => auth);
}

  // Logout user
  public logout() {
  this.afAuth.auth.signOut();
}
}
