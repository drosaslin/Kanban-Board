import { Component, OnInit, OnDestroy } from '@angular/core';
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

export class HomepageComponent implements OnInit, OnDestroy {
  private groupsList: AngularFireList<any>;
  private closeResult: string;
  private newDashboardName: string;
  private newGroupName: string;
  private currentSelectedGroup: string;
  private userGroups: Array<Group>;

  constructor(
    private modalService: NgbModal,
    private router: Router,
    public model: KanbanModel
  ) { }

  ngOnInit() {
    this.newGroupName = '';
    this.newDashboardName = '';
    this.userGroups = [];

    this.setDefaultCurrentSelectedGroup();
    this.model.loadUserProfile();
  }

  ngOnDestroy() {
    this.model.setModelDefaultState();
  }

  public userGroupButtonClick(groupId: string): void {
    this.router.navigate(['groupManagement', groupId]);
  }

  public dashboardButtonClick(groupId: string, dashboardId: string): void {
    this.model.selectedDashboard = null;
    this.router.navigate(['dashboard', groupId, dashboardId]);
  }

  public newGroupButtonClick(content: string): void {
    this.openModal(content);
  }

  public createGroupButtonClick(): void {
    this.model.createNewGroup(this.newGroupName, null);
    this.newGroupName = '';
    this.closeModal();
  }

  public deleteGroupButtonClick(content: string, groupId: string): void {
    this.currentSelectedGroup = groupId;
    this.openSmallModal(content);
  }

  public deleteGroup(): void {
    this.model.deleteUserGroup(this.currentSelectedGroup);
    this.closeModal();
  }

  public newDashboardButtonClick(content: string, groupId: string) {
    this.currentSelectedGroup = groupId;
    this.openModal(content);
  }

  public createDashboardButtonClick(): void {
    this.model.createNewDashboard(this.newDashboardName, this.currentSelectedGroup);
    this.setDefaultCurrentSelectedGroup();
    this.newDashboardName = '';
    this.closeModal();
  }

  private setDefaultCurrentSelectedGroup(): void {
    this.currentSelectedGroup = '';
  }

  private openModal(content: string): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = 'Closed with: ${result}';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private openSmallModal(content: string): void {
    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = 'Closed with: ${result}';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private closeModal(): void {
    this.modalService.dismissAll();
    this.setDefaultCurrentSelectedGroup();
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
}
