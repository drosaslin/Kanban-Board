import { Dashboard } from './dashboard';
import { User } from './user';

export class Group {
    private readonly adminPermission = 'admin';
    private readonly memberPermission = 'member';

    key: string;
    name: string;
    members: Map<string, Array<User>>;
    dashboards: Array<Dashboard>;

    public constructor(newGroup: any, newKey: string) {
        this.key = newKey;
        this.name = (newGroup['name'] == null) ? '' : newGroup['name'];
        this.dashboards = [];
        this.members = new Map<string, Array<User>>();
        this.members[this.adminPermission] = [];
        this.members[this.memberPermission] = [];
    }

    public getKey(): string {
        return this.key;
    }

    public getName(): string {
        return this.name;
    }

    public getMembers(): Map<string, Array<User>> {
        return this.members;
    }

    public getDashboards(): Array<Dashboard> {
        return this.dashboards;
    }

    public addMember(member: any, memberId: string, isAdmin: boolean): void {
        if (isAdmin) {
            this.members[this.adminPermission].push(new User(member, memberId));
        } else {
            this.members[this.memberPermission].push(new User(member, memberId));
        }

        console.log(this.members[this.adminPermission], this.members[this.memberPermission]);
    }

    public updateGroup(newGroup: any): void {
        this.name = (newGroup['name'] == null) ? '' : newGroup['name'];
    }
}
