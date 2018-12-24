import { Column } from './column';
import { Task } from './task';

export class Dashboard {
    key: string;
    name: string;
    type: string;
    group: string;
    owners: Array<string>;
    tasks: Array<Task>;
    columns: Array<Column>;

    public constructor(dashboard: any, newKey: string) {
        this.key = newKey;
        this.name = dashboard['name'];
        this.type = dashboard['type'];
        this.owners = dashboard['owners'];
        this.group = dashboard['group'];
        this.columns = [];
        this.tasks = [];
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

    public getGroup(): string {
        return this.group;
    }

    public sortColumns(): void {
        for (let n = this.columns.length - 1; n > 0; n--) {
            for (let i = n - 1 ; i >= 0; i--) {
                if (this.columns[n].index < this.columns[i].index) {
                    this.swapColumns(n, i);
                } else {
                    break;
                }
            }
        }
    }

    private swapColumns(index1: number, index2: number): void {
        const temp = this.columns[index1];
        this.columns[index1] = this.columns[index2];
        this.columns[index2] = temp;
    }
}
