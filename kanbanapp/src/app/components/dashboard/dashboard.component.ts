import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  groups: Array<any> = [
    {
      name: 'To Do',
      items: [{name: 'Item A'}, {name: 'Item B'}, {name: 'Item C'}, {name: 'Item D'}],
      isAddTaskEnabled: false
    },
    {
      name: 'Doing',
      items: [{name: 'Item 1'}, {name: 'Item 2'}, {name: 'Item 3'}, {name: 'Item 4'}],
      isAddTaskEnabled: false
    }
  ];

  constructor(private dragulaService: DragulaService) {
    this.dragulaService.createGroup('COLUMNS', {
      direction: 'horizontal',
      moves: (el, source, handle) => handle.className === 'group-handle'
    });
  }

  ngOnInit() {
  }

  private addTaskButtonClick(index): void {
    this.groups[index].isAddTaskEnabled = !this.groups[index].isAddTaskEnabled;
  }

  private addTableButtonClick(): void {
    this.groups.push({
      name: 'New Table',
      items: [{}],
      isAddTaskEnabled: false
    });
  }
}
