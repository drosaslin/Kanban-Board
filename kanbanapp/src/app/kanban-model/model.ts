import { Injectable } from '@angular/core';
import { User } from './classes/user';
import { Group } from './classes/group';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ISubject } from '../kanban-model/interfaces/isubject';
import { IObserver } from '../kanban-model/interfaces/iobserver';

@Injectable()
export class KanbanModel implements ISubject {
    private readonly usersBaseRoute = 'users/';
    private readonly groupsBaseRoute = 'groups/';

    private userSubscription: any;
    private groupsSubscription: any[];
    private observers: IObserver[];
    private user: User;
    private groups: Array<Group>;

    constructor(private database: AngularFireDatabase, public afAuth: AngularFireAuth) {
        this.observers = [];
        this.groups = [];
        this.userSubscription = null;
        this.groupsSubscription = null;
    }

    // Returns the current user's data
    public getUser(): User {
        return this.user;
    }

    public createNewGroup(groupName: string): void {
        // Creating the three default columns for the dashboard
        const columnRef1 = this.database.database.ref('columns').push({
            name: 'To do',
            index: 0,
            tasks: []
        });

        const columnRef2 = this.database.database.ref('columns').push({
            name: 'Doing',
            index: 1,
            tasks: []
        });

        const columnRef3 = this.database.database.ref('columns').push({
            name: 'Done',
            index: 2,
            tasks: []
        });

        // Creating default personal dashboard
        const dashboardRef = this.database.database.ref('dashboards').push({
            owner: this.user.getKey(),
            name: 'My dashboard',
            type: 'personal',
            columns: [columnRef1.key,
            columnRef2.key,
            columnRef3.key]
        });

        // Creating default personal group for the user
        const groupRef = this.database.database.ref('groups').push({
            members: [],
            name: groupName,
            admins: [this.user.getKey()],
            dashboards: [dashboardRef.key]
        });

        // Adding user additional information to users table in firebase database
        this.user.getGroups().push(groupRef.key);
        this.database.object(this.usersBaseRoute + this.user.getKey())
            .update({
                groups: this.user.getGroups()
            });
    }

    // Retrieving user profile data and loading it in the User's class
    // This function will be called every time the user data changes in the database
    public loadUserProfile(): void {
        if (this.userSubscription === null) {
            this.userSubscription = this.database.object(this.usersBaseRoute + this.afAuth.auth.currentUser.uid).valueChanges()
                .subscribe((user: any) => {
                    this.user = new User(user, this.afAuth.auth.currentUser.email, this.afAuth.auth.currentUser.uid);
                    this.loadUserGroups(this.user.getGroups());
                });
        } else {
            this.notifyObservers();
        }
    }

    // Retrieves the groups of the user, and stores their data in an array of type Group
    public loadUserGroups(groups: Array<string>): void {
        const groupSize: number = groups.length;
        this.groups = [];

        for (let index = 0; index < groupSize; index++) {
            this.database.object(this.groupsBaseRoute + groups[index]).valueChanges()
                .subscribe((group: any) => {
                    this.groups.push(new Group(group, groups[index]));
                    this.notifyObservers();
                });
        }
    }

    // Updates the user profile's data
    public updateUserProfile(newFirstName: string, newLastName: string, newUsername: string): void {
        this.database.object(this.usersBaseRoute + this.user.getKey())
            .update({
                firstName: newFirstName,
                lastName: newLastName,
                username: newUsername
            });
    }

    public registerObserver(observer: IObserver): void {
        this.observers.push(observer);
    }

    public removeObserver(observer: IObserver): void {
        this.observers.splice(this.observers.indexOf(observer), 1);
    }

    public notifyObservers(): void {
        for (let n = this.observers.length - 1; n >= 0; n--) {
            this.observers[n].update(this.user, this.groups);
        }
    }

    public resetModel(): void {
        this.observers = [];
        this.groups = [];
        this.user = null;
        this.userSubscription.unsubscribe();
        this.userSubscription = null;
    }
}
