import { Injectable } from '@angular/core';
import { User } from './classes/user';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

// @Injectable()
export class KanbanModel {
    db: any;
    afAuth: any;

    constructor(db: AngularFireDatabase, afAuth: AngularFireAuth) {
    }

    // public loadUserData(): any {
    //     let user$: any;

        // this.db.object('users/' + this.afAuth.auth.currentUser.uid).valueChanges()
        //     .subscribe(user => {
        //         user$ = user;
        //         console.log(user$);
        //     });
    // }
}
