import { Dashboard } from './dashboard';

export class Group {
    key: string;
    name: string;
    members: Array<string>;
    admins: Array<string>;
    dashboards: Array<Dashboard>;

    public constructor(newGroup: any, newKey: string) {
        this.key = newKey;
        this.name = (newGroup['name'] == null) ? '' : newGroup['name'];
        this.members = (newGroup['members'] == null) ? [] : newGroup['members'];
        this.admins = (newGroup['admins'] == null) ? [] : newGroup['admins'];
        this.dashboards = [];
    }

    public getKey(): string {
        return this.key;
    }

    public getName(): string {
        return this.name;
    }

    public getMembers(): Array<any> {
        return this.members;
    }

    public getAdmins(): Array<any> {
        return this.admins;
    }

    public getDashboards(): Array<Dashboard> {
        return this.dashboards;
    }

    public updateGroup(newGroup: any): void {
        this.name = (newGroup['name'] == null) ? '' : newGroup['name'];
        this.members = (newGroup['members'] == null) ? [] : newGroup['members'];
        this.admins = (newGroup['admins'] == null) ? [] : newGroup['admins'];
    }
}
