import { Injectable } from '@angular/core';
import { User } from './classes/user';
import { Group } from './classes/group';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ISubject } from '../kanban-model/interfaces/isubject';
import { IObserver } from '../kanban-model/interfaces/iobserver';
import { Dashboard } from './classes/dashboard';
import { Column } from './classes/column';
import { Task } from './classes/task';

@Injectable()
export class KanbanModel implements ISubject {
    readonly usersBaseRoute = 'users/';
    readonly groupsBaseRoute = 'groups/';
    readonly dashboardsBaseRoute = 'dashboards/';
    readonly columnsBaseRoute = 'columns/';
    readonly tasksBaseRoute = 'tasks/';

    userListSubscription: any;
    userSubscription: any;
    columnsSubscription: any;
    tasksSubscription: any;
    groupsSubscriptions: any[];
    dashboardsSubscriptions: any[];
    observers: IObserver[];
    user: User;
    groups: Array<Group>;
    selectedGroup: Group;
    selectedDashboard: Dashboard;
    usersList: Array<string> = [];

    constructor(private database: AngularFireDatabase, public afAuth: AngularFireAuth) {
        this.observers = [];
        this.groups = [];
        this.groupsSubscriptions = [];
        this.dashboardsSubscriptions = [];
        this.user = null;
        this.userListSubscription = null;
        this.userSubscription = null;
        this.columnsSubscription = null;
        this.tasksSubscription = null;
        this.selectedGroup = null;
        this.selectedDashboard = null;
        this.retrieveAllUsers();
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

        const taskRef = this.database.database.ref(this.tasksBaseRoute).push({
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
        const dashboardRef = this.database.database.ref(this.dashboardsBaseRoute).push({
            owner: this.user.getKey(),
            name: dashboardName,
            type: 'personal',
            group: groupId,
            tasks: [taskRef.key],
            columns: [columnRef1.key,
            columnRef2.key,
            columnRef3.key]
        });

        // Adds dashboard Id to columns
        this.database.database.ref(this.columnsBaseRoute + columnRef1.key).update({
            dashboard: dashboardRef.key
        });

        this.database.database.ref(this.columnsBaseRoute + columnRef2.key).update({
            dashboard: dashboardRef.key
        });

        this.database.database.ref(this.columnsBaseRoute + columnRef3.key).update({
            dashboard: dashboardRef.key
        });

        this.database.database.ref(this.tasksBaseRoute + taskRef.key).update({
            dashboard: dashboardRef.key
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

    public createNewColumn(columnName: string) {
        const columnRef1 = this.database.database.ref(this.columnsBaseRoute).push({
            name: columnName,
            dashboard: this.selectedDashboard.key,
            index: this.selectedDashboard.columns.length - 1,
            tasks: []
        });

        this.database.database.ref(this.dashboardsBaseRoute + this.selectedDashboard.key).child('columns')
            .child((this.selectedDashboard.columns.length).toString()).set(columnRef1.key);
    }

    public createNewTask(columnId: string, content: string): void {
        const taskRef = this.database.database.ref(this.tasksBaseRoute).push({
            content: content,
            description: '',
            index: 0,
            dueDate: '',
            members: [],
            comments: [],
            column: columnId,
            dashboard: this.selectedDashboard.key
          });

        this.database.database.ref(this.dashboardsBaseRoute + this.selectedDashboard.key).child('tasks')
          .child((this.selectedDashboard.columns.length).toString()).set(taskRef.key);
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

    public updateColumnOrder(updatedColumns: Array<Column>): void {
        this.selectedDashboard.columns = updatedColumns;
        for (let n = 0; n < this.selectedDashboard.columns.length; n++) {
            this.selectedDashboard.columns[n].index = n;
            this.database.object(this.columnsBaseRoute + this.selectedDashboard.columns[n].key)
                .update({
                    index: n
            });
        }
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
                // This function will fire the first time the user is loaded, and every time a change in this group is made.
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
                            this.notifyObservers();
                        })
                );
            }
        }
    }

    // Looping through all the dashboards in a group, retrieving their data, and loading them into its respective group
    public loadGroupDashboards(dashboards: any[], groupIndex: number): void {
        if (dashboards == null) {
            return;
        }

        const size = dashboards.length;
        for (let n = 0; n < size; n++) {
            if (this.isNewDashboard(dashboards[n], groupIndex)) {
                this.dashboardsSubscriptions.push(
                    // This function will fire the first time the user is loaded, and every time a change in this dashboard is made.
                    // The possible triggers of this function are the following:
                    // 1. loads the dashboard for the first time.
                    // 2. add, delete tables or columns.
                    // 3. change dashboard's data.
                    this.database.object(this.dashboardsBaseRoute + dashboards[n]).valueChanges()
                        .subscribe((dashboard: any) => {
                            if (this.isNewDashboard(dashboards[n], groupIndex)) {
                                this.groups[groupIndex].dashboards.push(new Dashboard(dashboard, dashboards[n]));
                            }
                            this.notifyObservers();
                        })
                );
            }
        }
    }

    public loadDashboardColumns(dashboardId: string): void {
        if (this.columnsSubscription === null && this.selectedDashboard !== null) {
            this.selectedDashboard.columns = [];
            this.columnsSubscription =
                this.database.list(this.columnsBaseRoute, columns => columns.orderByChild('dashboard').equalTo(dashboardId))
                    .snapshotChanges().subscribe(columns => {
                        columns.forEach(element => {
                            if (this.isNewColumn(element.key)) {
                                this.selectedDashboard.columns.push(new Column(element.payload.val(), element.key));
                            } else {
                                this.updateColumns(columns);
                            }
                        });
                        this.selectedDashboard.sortColumns();
                        this.notifyObservers();
                    });
        }
    }

    public loadDashboardTasks(dashboardId: string): void {
        if (this.tasksSubscription === null && this.selectedDashboard !== null) {
            this.selectedDashboard.tasks = [];
            this.tasksSubscription =
                this.database.list(this.tasksBaseRoute, tasks => tasks.orderByChild('dashboard').equalTo(dashboardId))
                    .snapshotChanges().subscribe(tasks => {
                        tasks.forEach(element => {
                            if (this.isNewTask(element.key)) {
                                this.selectedDashboard.addTask(new Task(element.payload.val(), element.key));
                            }
                        });
                        this.updateTasks(tasks);
                        this.selectedDashboard.sortTasks();
                        this.notifyObservers();
                        console.log('task update');
                    });
        }
    }

    public updateColumnName(key: string, newName: string): void {
        console.log(key, newName);
        this.database.database.ref(this.columnsBaseRoute + key)
            .update({
                name: newName
            });
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

    public resetModel(): void {
        this.observers = [];
        this.groups = [];
        this.groupsSubscriptions = [];
        this.dashboardsSubscriptions = [];
        this.user = null;
        this.userListSubscription = null;
        this.userSubscription = null;
        this.columnsSubscription = null;
        this.tasksSubscription = null;
        this.selectedGroup = null;
        this.selectedDashboard = null;
        this.unsubscribeFromDatabase();
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

    private isNewTask(taskId: string) {
        for (let n = 0; n < this.selectedDashboard.tasks.length; n++) {
            if (this.selectedDashboard.tasks[n].key === taskId) {
                return false;
            }
        }

        return true;
    }

    private isNewColumn(columnId: string): boolean {
        if (this.selectedDashboard === null) {
            return false;
        }

        for (let n = this.selectedDashboard.columns.length - 1; n >= 0; n--) {
            if (this.selectedDashboard.columns[n].key === columnId) {
                return false;
            }
        }

        return true;
    }

    private updateGroup(group: any, groupIndex: number): void {
        this.groups[groupIndex].updateGroup(group);
        this.loadGroupDashboards(group['dashboards'], groupIndex);
    }

    private updateColumns(columns: any[]) {
        let alreadyExist = false;
        const size = this.selectedDashboard.columns.length;
        for (let n = 0; n < size; n++) {
            alreadyExist = false;
            for (let i = 0; i < columns.length; i++) {
                if (this.selectedDashboard.columns[n].key === columns[i].key) {
                    this.selectedDashboard.columns[n].updateColumn(columns[i].payload.val());
                    alreadyExist = true;
                    break;
                }
            }
            if (!alreadyExist && size > columns.length) {
                this.selectedDashboard.columns.splice(n, 1);
                break;
            }
        }
    }

    private updateTasks(tasks: any[]) {
        let alreadyExist = false;
        const size = this.selectedDashboard.columns.length;
        for (let n = 0; n < size; n++) {
            alreadyExist = false;
            for (let i = 0; i < tasks.length; i++) {
                if (this.selectedDashboard.tasks[n].key === tasks[i].key) {
                    this.selectedDashboard.tasks[n].updateTask(tasks[i].payload.val());
                    alreadyExist = true;
                    break;
                }
            }
            if (!alreadyExist && size > tasks.length) {
                this.selectedDashboard.deleteTask(n);
                this.selectedDashboard.tasks.splice(n, 1);
                break;
            }
        }
    }

    public updateTaskColumn(destinationId: string, taskKey: string) {
        this.database.object(this.tasksBaseRoute + taskKey).update({
            column: destinationId
        });
    }

    public retrieveGroupById(groupId: string): void {
        if (this.groups == null || this.selectedGroup != null && this.selectedGroup.key === groupId) {
            return;
        }

        for (let n = 0; n < this.groups.length; n++) {
            if (this.groups[n].key === groupId) {
                this.selectedGroup = this.groups[n];
                break;
            }
        }
    }

    public addTaskDescription(descr: string, taskId: string): void {
        this.database.object(this.tasksBaseRoute + taskId)
            .update({
                description: descr
            });
    }

    public addTaskComment(comment: string, username: string, taskId: string) {
        this.database.database.ref(this.tasksBaseRoute + taskId).child('comments')
            .child(this.user.getFirstName()).set(comment);
    }

    public retrieveAllUsers() {
        // let length: number;
        this.userListSubscription = this.database.list('users').valueChanges()
            .subscribe(users => {
                users.forEach(user => {
                    console.log(user['username']);
                    this.usersList.push(user['username']);
                });
                this.userListSubscription.unsubscribe();
                this.userListSubscription = null;

            });

        // length = this.usersList.length;
        // console.log(this.usersList[0]);
        // for (let x = 0; x < length; x++) {
        //     console.log(x);
        //     console.log(this.usersList[x].getKey());
        // }
    }

    public retrieveDashboardById(dashboardId: string): void {
        if (this.selectedGroup == null || this.selectedDashboard != null && this.selectedDashboard.key === dashboardId) {
            return;
        }

        // console.log(0, dashboardId);
        // if (this.selectedDashboard != null) {
        //     console.log(1, this.selectedDashboard.key);
        // }
        // if (this.selectedDashboard != null && this.selectedDashboard.key !== dashboardId) {
            for (let n = this.selectedGroup.dashboards.length - 1; n >= 0; n--) {
                if (this.selectedGroup.dashboards[n].key === dashboardId) {
                    this.selectedDashboard = this.selectedGroup.dashboards[n];
                    break;
                }
            }
        // }
    }

    // Stop listening for changes in the database
    private unsubscribeFromDatabase(): void {
        if (this.userSubscription != null) {
            this.userSubscription.unsubscribe();
            this.userSubscription = null;
        }
        if (this.columnsSubscription != null) {
            this.columnsSubscription.unsubscribe();
            this.columnsSubscription = null;
        }
        if (this.tasksSubscription != null) {
            this.tasksSubscription.unsubscribe();
            this.tasksSubscription = null;
        }

        for (let n = this.groupsSubscriptions.length - 1; n >= 0; n--) {
            this.groupsSubscriptions[n].unsubscribe();
            this.groupsSubscriptions[n] = null;
        }

        for (let n = this.dashboardsSubscriptions.length - 1; n >= 0; n--) {
            this.dashboardsSubscriptions[n].unsubscribe();
            this.dashboardsSubscriptions[n] = null;
        }
    }
}
