import { Comment } from './comment';

export class Task {
    key: string;
    content: string;
    description: string;
    dueDate: any;
    label: Array<any>;
    members: Array<any>;
    index: number;
    columnId: string;
    dashboardId: string;
    comments: Array<Comment>;

    public constructor(task: any, taskId: string) {
        this.key = taskId;
        this.content = (task['content'] == null) ? '' : task['content'];
        this.description = (task['description'] == null) ? '' : task['description'];
        this.dueDate = (task['dueDate'] == null) ? '' : task['dueDate'];
        this.dashboardId = (task['dashboard'] == null) ? '' : task['dashboard'];
        this.index = (task['index'] == null) ? -1 : task['index'];
        this.columnId = (task['column'] == null) ? '' : task['column'];
        this.members = (task['members'] == null) ? [] : task['members'];
        this.comments = [];

        if (task['comments'] != null) {
            for (let n = 0; n < task['comments'].length; n++) {
                this.comments.push(new Comment(task['comments'][n]));
            }
        }
    }

    public updateTask(task: any) {
        this.content = (task['content'] == null) ? '' : task['content'];
        this.description = (task['description'] == null) ? '' : task['description'];
        this.dueDate = (task['dueDate'] == null) ? '' : task['dueDate'];
        this.dashboardId = (task['dashboard'] == null) ? '' : task['dashboard'];
        this.index = (task['index'] == null) ? -1 : task['index'];
        this.columnId = (task['column'] == null) ? '' : task['column'];
        this.members = (task['members'] == null) ? [] : task['members'];
    }
}
