import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import 'rxjs/add/operator/map';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { FormGroup, FormControl, Validators } from '../../../node_modules/@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userList: AngularFireList<any>;
  form: FormGroup;

  constructor(public afAuth: AngularFireAuth, private db: AngularFireDatabase, private router: Router) {
    this.form = new FormGroup({
      $key: new FormControl(null),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      username: new FormControl('', Validators.required),
      email: new FormControl('', Validators.email),
      password1: new FormControl('', Validators.minLength(6)),
      password2: new FormControl('', Validators.minLength(6))
    });
  }

  // Firebase login authentication
  public login(email: string, password: string) {
    return new Promise((_resolve, _reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then(userData => _resolve(userData),
          err => _reject(err));
    });
  }

  // Listens to any changes in the database
  getUsers() {
    this.userList = this.db.list('users');
    return this.userList.snapshotChanges();
  }

  // Creates an account
  public signup(firstName, lastName, email, username, password) {
    // Creates an account and saves both email and password in database auth section. A random uid is generated.
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)

      // The extra user information is sent to the firebase database after the user is created
      .then((res) => {
        // Creating the three default columns for the dashboard
        const columnRef1 = this.db.database.ref('columns').push({
          name: 'To do',
          index: 0,
          tasks: []
        });

        const columnRef2 = this.db.database.ref('columns').push({
          name: 'Doing',
          index: 1,
          tasks: []
        });

        const columnRef3 = this.db.database.ref('columns').push({
          name: 'Done',
          index: 2,
          tasks: []
        });

        // Creating default personal dashboard
        const dashboardRef = this.db.database.ref('dashboards').push({
          owner: this.afAuth.auth.currentUser.uid,
          name: 'My dashboard',
          type: 'personal',
          columns: [columnRef1.key,
          columnRef2.key,
          columnRef3.key]
        });

        // Creating default personal group for the user
        const groupRef = this.db.database.ref('groups').push({
          members: [],
          name: 'Personal',
          admins: [this.afAuth.auth.currentUser.uid],
          dashboards: [dashboardRef.key]
        });

        // Adding user additional information to users table in firebase db
        this.db.database.ref('users/' + this.afAuth.auth.currentUser.uid).set({
          firstName: firstName,
          lastName: lastName,
          username: username,
          groups: [groupRef.key]
        });

        // Redirects the user to the login page
        this.logout();
        this.router.navigate(['']);
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

  // Get the id of the current user
  public getCurrentUserId(): string {
    return this.afAuth.auth.currentUser.uid;
  }
}
