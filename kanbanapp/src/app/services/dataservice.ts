import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {
    private messageSource = new BehaviorSubject<string>(null);
    public currentGroup = this.messageSource.asObservable();

    public constructor() {}

    public changeSelectedGroup(groupId: string): void {
        this.messageSource.next(groupId);
    }
}
