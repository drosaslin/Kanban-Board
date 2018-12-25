import { Task } from './task';

export class Column {
    key: string;
    dashboardId: string;
    index: number;
    name: string;
    tasks: Array<Task>;

    public constructor(newColumn: any, newKey: string) {
        this.key = newKey;
        this.dashboardId = newColumn['dashboard'];
        this.index = newColumn['index'];
        this.name = newColumn['name'];
        this.tasks = [];
    }

    public updateColumn(column: any) {
        this.dashboardId = column['dashboardId'];
        this.index = column['index'];
        this.name = column['name'];
    }

    public sortTasks() {
        for (let n = this.tasks.length - 1; n > 0; n--) {
            for (let i = n - 1; i >= 0; i--) {
                if (this.tasks[n].index < this.tasks[i].index) {
                    this.swapTasks(n, i);
                } else {
                    break;
                }
            }
        }
    }

    private swapTasks(index1: number, index2: number): void {
        const temp = this.tasks[index1];
        this.tasks[index1] = this.tasks[index2];
        this.tasks[index2] = temp;
    }
}
