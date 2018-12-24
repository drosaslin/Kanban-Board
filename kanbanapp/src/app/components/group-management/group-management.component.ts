import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/dataservice';
import { Group } from '../../kanban-model/classes/group';
import { KanbanModel } from 'src/app/kanban-model/model';
import { IObserver } from '../../kanban-model/interfaces/iobserver';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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
  newDashboardName: string;
  group: Group;
  groupAllMembers: Map<string, string>;

  userType = 'Member';
  constructor(
    private selectedItems: DataService,
    private modalService: NgbModal,
    private model: KanbanModel,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('groupId');
    this.model.loadUserProfile();
    this.model.registerObserver(this);
    this.model.retrieveGroupById(this.groupId);

    this.newDashboardName = '';
    // console.log(this.model.selectedGroup);
    // console.log(this.model.selectedGroup.getAdmins());
  }

  public newDashboardButtonClick(content: string): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      // this.closeResult = 'Closed with: ${result}';
      // this.setDefaultCurrentSelectedGroup();
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public createDashboardButtonClick(): void {
    this.model.createNewDashboard(this.newDashboardName, this.groupId);
    this.newDashboardName = '';
  }

  public update(user: User, group: Group[]): void {
    this.model.retrieveGroupById(this.groupId);
  }
}
