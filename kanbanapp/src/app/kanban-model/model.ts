import { Injectable } from '@angular/core';
import { User } from './classes/user';
import { Group } from './classes/group';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ISubject } from '../kanban-model/interfaces/isubject';
import { IObserver } from '../kanban-model/interfaces/iobserver';
import { Dashboard } from './classes/dashboard';

@Injectable()
export class KanbanModel implements ISubject {
    readonly usersBaseRoute = 'users/';
    readonly groupsBaseRoute = 'groups/';
    readonly dashboardsBaseRoute = 'dashboards/';

    userSubscription: any;
    groupsSubscriptions: any[];
    dashboardsSubscriptions: any[];
    observers: IObserver[];
    currentSelectedGroup: string;
    user: User;
    groups: Array<Group>;

    constructor(private database: AngularFireDatabase, public afAuth: AngularFireAuth) {
        this.observers = [];
        this.groups = [];
        this.groupsSubscriptions = [];
        this.dashboardsSubscriptions = [];
        this.user = null;
        this.userSubscription = null;
    }

    // Returns the current user's data
    public getUser(): User {
        return this.user;
    }

    // Creates a new group with no dashboards
    public createNewGroup(groupName: string): void {
        // creates a new group in the database
        const groupRef = this.database.database.ref('groups').push({
            members: [],
            name: groupName,
            admins: [this.user.getKey()]
        });

        // Updates the group list of the user
        this.user.getGroups().push(groupRef.key);
        this.database.object(this.usersBaseRoute + this.user.getKey())
            .update({
                groups: this.user.getGroups()
            });
    }

    public createNewDashboard(dashboardName: string): void {
        console.log('creating' + dashboardName);
    }

    // Retrieving user profile data and loading it in the User's class
    // This function will be called every time the user data changes in the database
    public loadUserProfile(): void {
        if (this.userSubscription === null) {
            // This function will fire the first time the user is loaded, and every time a change in this user is made.
            // The possible triggers of this function are the following:
            // 1. load the user for the first time.
            // 2. add, delete groups.
            // 3. change user's info.
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

        // Looping through all groups in the user and adds or deletes the group from the groups array if needed
        for (let index = 0; index < groupSize; index++) {
            if (this.isNewGroup(groups[index])) {
                // This function will fire the first time the user is loaded, and every time a change in this user is made.
                // The possible triggers of this function are the following:
                // 1. loads the group for the first time.
                // 2. add, delete dashboards.
                // 3. add, delete members or admins.
                // 4. change group's name.
                this.groupsSubscriptions.push(
                    this.database.object(this.groupsBaseRoute + groups[index]).valueChanges()
                        .subscribe((group: any) => {
                            this.groups.push(new Group(group, groups[index]));
                            this.loadGroupDashboards(group['dashboards'], this.groups.length - 1);
                        })
                );
            }
        }
    }

    public loadGroupDashboards(dashboards: any[], groupIndex: number): void {
        if (dashboards == null) {
            return;
        }

        const size = dashboards.length;
        for (let n = 0; n < size; n++) {
            this.dashboardsSubscriptions.push(
                this.database.object(this.dashboardsBaseRoute + dashboards[n]).valueChanges()
                    .subscribe((dashboard: any) => {
                        this.groups[groupIndex].getDashboards().push(new Dashboard(dashboard, dashboards[n]));
                    })
            );
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

        for (let n = this.groupsSubscriptions.length - 1; n >= 0; n--) {
            this.groupsSubscriptions[n].unsubscribe();
            this.groupsSubscriptions[n] = null;
        }
    }

    private isNewGroup(groupId: string): boolean {
        for (let n = this.groups.length - 1; n >= 0; n--) {
            if (this.groups[n].getKey() === groupId) {
                return false;
            }
        }

        return true;
    }
}
