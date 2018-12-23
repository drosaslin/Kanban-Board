import { Injectable } from '@angular/core';
import { User } from './classes/user';
import { Group } from './classes/group';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ISubject } from '../kanban-model/interfaces/isubject';
import { IObserver } from '../kanban-model/interfaces/iobserver';
import { Dashboard } from './classes/dashboard';
import { Column } from './classes/column';

@Injectable()
export class KanbanModel implements ISubject {
    readonly usersBaseRoute = 'users/';
    readonly groupsBaseRoute = 'groups/';
    readonly dashboardsBaseRoute = 'dashboards/';
    readonly columnsBaseRoute = 'columns/';
    readonly tasksBaseRoute = 'tasks/';

    userSubscription: any;
    groupsSubscriptions: any[];
    dashboardsSubscriptions: any[];
    observers: IObserver[];
    currentSelectedGroup: string;
    user: User;
    groups: Array<Group>;
    selectedGroup: Group;

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
    public createNewGroup(groupName: string, dashboardKey: string): void {
        // creates a new group in the database
        const groupRef = this.database.database.ref('groups').push({
            members: [],
            name: groupName,
            admins: [this.user.getKey()]
            // columns: [dashboardKey]
        });

        // Updates the group list of the user
        this.user.getGroups().push(groupRef.key);
        this.database.object(this.usersBaseRoute + this.user.getKey())
            .update({
                groups: this.user.getGroups()
            });
    }

    public createNewDashboard(dashboardName: string, groupId: string): void {
        // const defaultColumns: Array<string> = this.createDefaultColumns();
        const columnRef1 = this.database.database.ref(this.columnsBaseRoute).push({
            name: 'To do',
            index: 0,
            tasks: []
        });

        const columnRef2 = this.database.database.ref(this.columnsBaseRoute).push({
            name: 'Doing',
            index: 1,
            tasks: []
        });

        const columnRef3 = this.database.database.ref(this.columnsBaseRoute).push({
            name: 'Done',
            index: 2,
            tasks: []
        });

        // Creating default personal dashboard
        const dashboardRef = this.database.database.ref(this.dashboardsBaseRoute).push({
            owner: this.user.getKey(),
            name: dashboardName,
            type: 'personal',
            columns: [columnRef1.key,
            columnRef2.key,
            columnRef3.key]
        });

        const newDashboards: Array<string> = [];
        for (let n = this.groups.length - 1; n >= 0; n--) {
            if (this.groups[n].key === groupId) {
                for (let i = this.groups[n].dashboards.length - 1; i >= 0; i--) {
                    newDashboards.push(this.groups[n].dashboards[i].key);
                }
                newDashboards.push(dashboardRef.key);
                break;
            }
        }

        this.database.object(this.groupsBaseRoute + groupId)
            .update({
                dashboards: newDashboards.reverse()
            });
    }

    // Deletes all data related to the specified group id such as: columns, tables, tasks, group info;
    // and updates the user info in the database
    public deleteUserGroup(groupId: string): void {
        const groupIds: Array<string> = [];

        for (let n = this.groups.length - 1; n >= 0; n--) {
            if (this.groups[n].key === groupId) {
                this.deleteGroupDashboards(this.groups[n]);
                this.groups.splice(n, 1);
            } else {
                groupIds.push(this.groups[n].key);
            }
        }

        this.database.object(this.groupsBaseRoute + groupId).remove();
        this.database.object(this.usersBaseRoute + this.user.getKey())
            .update({
                groups: groupIds.reverse()
            });
    }

    // Iterate through all dashboards of a group and delete them one by one from the database
    public deleteGroupDashboards(group: Group): void {
        for (let n = group.dashboards.length - 1; n >= 0; n--) {
            this.deleteDashboard(group.dashboards[n].key);
        }
    }

    // Deletes the specified dashboard from the database
    public deleteDashboard(dashboardId: string): void {
        this.database.object(this.dashboardsBaseRoute + dashboardId).remove();
    }

    // Iterate through all columns of a dashboard and deletes them one by one from the database
    public deleteDashboardColumns(columns: Array<Column>): void {
        for (let n = columns.length - 1; n >= 0; n--) {
            this.deleteColumn(columns[n].key);
        }
    }

    // Deletes the specified column
    public deleteColumn(columnId: string): void {
        this.database.object(this.columnsBaseRoute + columnId).remove();
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
                            if (this.isNewGroup(groups[index])) {
                                this.groups.push(new Group(group, groups[index]));
                                this.loadGroupDashboards(group['dashboards'], this.groups.length - 1);
                            } else {
                                this.updateGroup(group, index);
                            }
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
            if (this.isNewDashboard(dashboards[n], groupIndex)) {
                this.dashboardsSubscriptions.push(
                    this.database.object(this.dashboardsBaseRoute + dashboards[n]).valueChanges()
                        .subscribe((dashboard: any) => {
                            if (this.isNewDashboard(dashboard, groupIndex)) {
                                this.groups[groupIndex].dashboards.push(new Dashboard(dashboard, dashboards[n]));
                            }
                        })
                );
            }
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

    private isNewDashboard(dashboardId: string, groupIndex: number): boolean {
        for (let n = this.groups[groupIndex].dashboards.length - 1; n >= 0; n--) {
            if (this.groups[groupIndex].dashboards[n].key === dashboardId) {
                return false;
            }
        }

        return true;
    }

    private updateGroup(group: any, groupIndex: number): void {
        this.groups[groupIndex].updateGroup(group);
        this.loadGroupDashboards(group['dashboards'], groupIndex);
    }

    public retrieveGroupById(groupId: string): void {
        for (let n = 0; n < this.groups.length; n++) {
            if (this.groups[n].getKey() === groupId) {
                this.currentSelectedGroup = groupId;
                this.selectedGroup = this.groups[n];
            }
        }
    }

    // private createDefaultColumns(): Array<string> {
    //     // Creating the three default columns for the dashboard
    //     const columnRef1 = this.database.database.ref(this.columnsBaseRoute).push({
    //         name: 'To do',
    //         index: 0,
    //         tasks: []
    //     });

    //     const columnRef2 = this.database.database.ref(this.columnsBaseRoute).push({
    //         name: 'Doing',
    //         index: 1,
    //         tasks: []
    //     });

    //     const columnRef3 = this.database.database.ref(this.columnsBaseRoute).push({
    //         name: 'Done',
    //         index: 2,
    //         tasks: []
    //     });
    // }
}
