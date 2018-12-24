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

    public updateTasks(tasks: any[]) {
        for (let n = 0; n < tasks.length; n++) {
            // tasks.push(new Task(tasks[n]));
        }
    }
}
