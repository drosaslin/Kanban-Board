import { Component, OnInit, ComponentFactoryResolver, Injectable, Inject, ReflectiveInjector } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { DragulaService } from 'ng2-dragula';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';
import { NgModel } from '@angular/forms';
import { KanbanModel } from 'src/app/kanban-model/model';
import { User } from '../../kanban-model/classes/user';
import { Group } from '../../kanban-model/classes/group';
import { IObserver } from 'src/app/kanban-model/interfaces/iobserver';

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
  private userGroups: Array<Group>;

  constructor(
    private modalService: NgbModal,
    private model: KanbanModel
    ) {}

  ngOnInit() {
    this.newGroupName = '';
    this.newDashboardName = '';
    this.userGroups = [];

    this.model.registerObserver(this);
    this.model.loadUserProfile();
  }

  public newGroupButtonClick(content: string): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = 'Closed with: ${result}';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public createGroupButtonClick(): void {
    this.model.createNewGroup(this.newGroupName);
    this.newGroupName = '';
  }

  public newDashboardButtonClick(content: string) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = 'Closed with: ${result}';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public createDashboardclick(): void {
    this.model.createNewDashboard(this.newDashboardName);
  }

  // privateBtn() {
  //   console.log('AAAAAAAAAAA');
  // }

  // create() {
  //   console.log('AAAAAAAAAAA');
  // }

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
    this.userGroups = group;
    for (let n = 0; n < this.userGroups.length; n++) {
      // console.log(this.userGroups[n].getDashboards());
      for (let i = 0; i < this.userGroups[n].getDashboards().length; i++) {
        console.log(this.userGroups[n].getDashboards()[i].getName());
      }
    }
  }
}
