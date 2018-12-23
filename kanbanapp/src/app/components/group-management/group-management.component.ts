import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/dataservice';
import { Group } from '../../kanban-model/classes/group';
import { KanbanModel } from 'src/app/kanban-model/model';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from 'src/app/kanban-model/classes/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.css']
})
export class GroupManagementComponent implements OnInit {
  currentGroup: string;
  group: Group;
  groupAllMembers: Map<string, string>;

  userType = 'Member';
  constructor(
    private selectedItems: DataService,
    private model: KanbanModel,
    private route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => this.ngOnInit());
   }

  ngOnInit() {
    this.selectedItems.currentGroup.subscribe(groupId => this.currentGroup = groupId);
    this.model.retrieveGroupById(this.currentGroup);
    // console.log(this.model.selectedGroup);
    // console.log(this.model.selectedGroup.getAdmins());
  }

}
