export class Dashboard {
    key: string;
    name: string;
    type: string;
    owners: Array<string>;
    tasks: Array<any>;
    columns: Array<any>;

    public constructor(dashboard: any, newKey: string) {
        this.key = newKey;
        this.name = dashboard['name'];
        this.type = dashboard['type'];
        this.owners = dashboard['owners'];

        console.log(this);
    }

    public getKey(): string {
        return this.key;
    }

    public getName(): string {
        return this.name;
    }

    public getType(): string {
        return this.type;
    }

    public getOwners(): Array<any> {
        return this.owners;
    }

    public getTasks(): Array<any> {
        return this.tasks;
    }

    public getColumns(): Array<any> {
        return this.columns;
    }
}
