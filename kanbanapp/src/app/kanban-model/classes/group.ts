export class Group {
    private key: string;
    private name: string;
    private members: Array<any>;
    private admins: Array<any>;
    private dashboards: Array<any>;

    public constructor(newGroup: any, newKey: string) {
        this.key = newKey;
        this.name = newGroup['name'];
        this.members = newGroup['members'];
        this.admins = newGroup['admins'];
        this.dashboards = newGroup['dashboards'];
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

    public getDashboards(): Array<any> {
        return this.dashboards;
    }
}
