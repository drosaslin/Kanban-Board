export class Column {
    key: string;
    dashboardId: string;
    index: number;
    name: string;

    public constructor(newColumn: any, newKey: string) {
        this.key = newKey;
        this.dashboardId = newColumn['dashboard'];
        this.index = newColumn['index'];
        this.name = newColumn['name'];
    }

    public updateColumn(column: any) {
        this.dashboardId = column['dashboardId'];
        this.index = column['index'];
        this.name = column['name'];
    }
}
