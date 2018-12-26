import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class DataService {
    private groupSource = new BehaviorSubject<string>(null);
    private dashboardSource = new BehaviorSubject<string>(null);
    public currentGroup = this.groupSource.asObservable();
    public currentDashboard = this.dashboardSource.asObservable();

    public constructor() {}

    public changeSelectedGroup(groupId: string): void {
        this.groupSource.next(groupId);
    }

    public changeSelectedDashboard(dashboardId: string): void {
        this.dashboardSource.next(dashboardId);
    }
}
