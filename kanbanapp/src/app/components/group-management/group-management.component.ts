import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/dataservice';
import { Group } from '../../kanban-model/classes/group';
import { KanbanModel } from 'src/app/kanban-model/model';
import { IObserver } from '../../kanban-model/interfaces/iobserver';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from 'src/app/kanban-model/classes/user';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-group-management',
  templateUrl: './group-management.component.html',
  styleUrls: ['./group-management.component.css']
})
export class GroupManagementComponent implements OnInit, IObserver {
  groupId: string;
  group: Group;
  groupAllMembers: Map<string, string>;

  userType = 'Member';
  constructor(
    private selectedItems: DataService,
    private model: KanbanModel,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('groupId');
    this.model.loadUserProfile();
    this.model.registerObserver(this);
    this.model.retrieveGroupById(this.groupId);
    // console.log(this.model.selectedGroup);
    // console.log(this.model.selectedGroup.getAdmins());
  }

  public update(user: User, group: Group[]): void {
    this.model.retrieveGroupById(this.groupId);
  }
}
