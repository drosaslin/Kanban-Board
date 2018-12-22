export class User {
    private key: string;
    private firstName: string;
    private lastName: string;
    private username: string;
    private email: string;
    private groups: Array<string>;

    public constructor(newUser: any, newEmail: string, newKey: string) {
        this.key = newKey;
        this.firstName = newUser['firstName'];
        this.lastName = newUser['lastName'];
        this.groups = newUser['groups'];
        this.username = newUser['username'];
        this.email = newEmail;
    }

    public getKey(): string {
        return this.key;
    }

    public getFirstName(): string {
        return this.firstName;
    }

    public getLastName(): string {
        return this.lastName;
    }

    public getUsername(): string {
        return this.username;
    }

    public getEmail(): string {
        return this.email;
    }

    public getGroups(): Array<string> {
        return this.groups;
    }

    public setKey(newKey: string): void {
        this.key = newKey;
    }

    public setFirstName(newFirstName: string): void {
        this.firstName = newFirstName;
    }

    public setLastName(newLastName: string): void {
        this.lastName = newLastName;
    }

    public setUsername(newUsername: string): void {
        this.username = newUsername;
    }

    public setUserEmail(newUserEmail: string): void {
        this.email = newUserEmail;
    }

    public setGroups(newGroups: any[]): void {
        this.groups = newGroups;
    }
}
