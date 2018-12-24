import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireList } from 'angularfire2/database';
import { KanbanModel } from 'src/app/kanban-model/model';
import { User } from '../../kanban-model/classes/user';
import { Group } from '../../kanban-model/classes/group';
import { IObserver } from 'src/app/kanban-model/interfaces/iobserver';
import { Router } from '@angular/router';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent implements OnInit, IObserver {
  private groupsList: AngularFireList<any>;
  private closeResult: string;
  private newDashboardName: string;
  private newGroupName: string;
  private currentSelectedGroup: string;
  private userGroups: Array<Group>;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private model: KanbanModel
    ) {}

  ngOnInit() {
    this.newGroupName = '';
    this.newDashboardName = '';
    this.userGroups = [];

    this.setDefaultCurrentSelectedGroup();
    this.model.registerObserver(this);
    this.model.loadUserProfile();
  }

  public userGroupButtonClick(groupId: string): void {
    this.router.navigate(['groupManagement', groupId]);
  }

  public dashboardButtonClick(groupId: string, dashboardId: string): void {
    this.router.navigate(['dashboard', groupId, dashboardId]);
  }

  public newGroupButtonClick(content: string): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = 'Closed with: ${result}';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public createGroupButtonClick(): void {
    this.model.createNewGroup(this.newGroupName, null);
    this.newGroupName = '';
  }

  public deleteGroupButtonClick(groupId: string): void {
    this.model.deleteUserGroup(groupId);
  }

  public newDashboardButtonClick(content: string, groupId: string) {
    this.currentSelectedGroup = groupId;

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = 'Closed with: ${result}';
      this.setDefaultCurrentSelectedGroup();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public createDashboardButtonClick(): void {
    this.model.createNewDashboard(this.newDashboardName, this.currentSelectedGroup);
    this.setDefaultCurrentSelectedGroup();
    this.newDashboardName = '';
  }

  private setDefaultCurrentSelectedGroup(): void {
    this.currentSelectedGroup = '';
  }

  // 離開彈跳式視窗方法不同時，提示不同訊息
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public update(user: User, group: Array<Group>): void {
    console.log(this.model.groups[0].dashboards);
  }
}
