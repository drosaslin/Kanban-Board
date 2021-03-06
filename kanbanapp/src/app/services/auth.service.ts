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
          tasks: [],
          dashboard: ''
        });

        const columnRef2 = this.db.database.ref('columns').push({
          name: 'Doing',
          index: 1,
          tasks: [],
          dashboard: ''
        });

        const columnRef3 = this.db.database.ref('columns').push({
          name: 'Done',
          index: 2,
          tasks: [],
          dashboard: ''
        });

        const taskRef = this.db.database.ref('tasks').push({
          content: 'my first task',
          description: '',
          index: 0,
          dueDate: '',
          members: [],
          comments: [],
          column: columnRef1.key,
          dashboard: ''
        });

        // Creating default personal dashboard
        const dashboardRef = this.db.database.ref('dashboards').push({
          owner: this.afAuth.auth.currentUser.uid,
          name: 'My dashboard',
          type: 'personal',
          group: '',
          columns: [columnRef1.key,
          columnRef2.key,
          columnRef3.key],
          tasks: [taskRef.key]
        });

        // Creating default personal group for the user
        const groupRef = this.db.database.ref('groups').push({
          members: [],
          name: 'Personal',
          dashboards: [dashboardRef.key]
        });
        this.db.database.ref('groups').child(groupRef.key).child('members')
          .set([{
            member: this.afAuth.auth.currentUser.uid,
            permission: 'admin'
          }]);

        // Adds group Id to dashboard
        this.db.database.ref('dashboards/' + dashboardRef.key).update({
          group: groupRef.key
        });

        // Adds dashboard Id to columns
        this.db.database.ref('columns/' + columnRef1.key).update({
          dashboard: dashboardRef.key
        });

        this.db.database.ref('columns/' + columnRef2.key).update({
          dashboard: dashboardRef.key
        });

        this.db.database.ref('columns/' + columnRef3.key).update({
          dashboard: dashboardRef.key
        });

        this.db.database.ref('tasks/' + taskRef.key).update({
          dashboard: dashboardRef.key
        });

        // Adding user additional information to users table in firebase db
        this.db.database.ref('users/' + this.afAuth.auth.currentUser.uid).set({
          firstName: firstName,
          lastName: lastName,
          username: username,
          email: email,
          groups: [groupRef.key]
        });

        // Redirects the user to the homepage
        this.router.navigate(['homepage']);
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
