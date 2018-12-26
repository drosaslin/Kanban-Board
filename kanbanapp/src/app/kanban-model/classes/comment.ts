export class Comment {
    userFirstName: string;
    userLastName: string;
    content: string;

    public constructor(newComment: any) {
        this.userFirstName = (newComment['firstName'] == null) ? 'Unknown' : newComment['firstName'];
        this.userLastName = (newComment['lastName'] == null) ? 'User' : newComment['lastName'];
        this.content = (newComment['content'] == null) ? 'no content' : newComment['content'];
    }

    public editContent(newContent: string): void {
        this.content = newContent;
    }
}
