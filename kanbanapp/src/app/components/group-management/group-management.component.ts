import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/dataservice';

@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.css']
})
export class GroupManagementComponent implements OnInit {
  private currentGroup: string;

  userType = 'Member';
  constructor(
    private selectedGroup: DataService
  ) { }

  ngOnInit() {
    this.selectedGroup.currentGroup.subscribe(groupId => this.currentGroup = groupId);
    console.log(this.currentGroup);
  }

}
