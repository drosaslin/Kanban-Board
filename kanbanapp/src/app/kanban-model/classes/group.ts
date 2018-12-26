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
        if (!this.isAlreadyMember(memberId)) {
            if (isAdmin) {
                this.members[this.adminPermission].push(new User(member, memberId));
            } else {
                this.members[this.memberPermission].push(new User(member, memberId));
            }
        } else {
            this.updateMemberPermission(memberId, isAdmin);
        }
    }

    public updateMemberPermission(memberId: string, isAdmin: boolean): void {
        if (isAdmin && !this.isMemberInPermission(memberId, this.adminPermission) ||
            isAdmin && this.isMemberInPermission(memberId, this.adminPermission)) {
                this.swapPermissions(memberId, isAdmin);
        }
    }

    public isAlreadyMember(memberId: string): boolean {
        return (this.isMemberInPermission(memberId, this.adminPermission) ||
            this.isMemberInPermission(memberId, this.memberPermission));
    }

    public updateGroup(newGroup: any): void {
        this.name = (newGroup['name'] == null) ? '' : newGroup['name'];
    }

    private swapPermissions(memberId: string, isAdmin: boolean): void {
        const sourcePermission = (isAdmin) ? this.memberPermission : this.adminPermission;
        const targetPermission = (isAdmin) ? this.adminPermission : this.memberPermission;

        for (let n = 0; n < this.members[sourcePermission].length; n++) {
            if (this.members[sourcePermission][n].key === memberId) {
                const member = this.members[sourcePermission][n];
                this.members[sourcePermission].splice(n, 1);
                this.members[targetPermission].push(member);
                break;
            }
        }
    }

    private isMemberInPermission(memberId: string, permissionType: string): boolean {
        for (let n = 0; n < this.members[permissionType].length; n++) {
            if (memberId === this.members[permissionType][n].key) {
                return true;
            }
        }

        return false;
    }
}
