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
  private newBoardName: string;
  private newGroupName: string;
  private personalDashboards: Array<any> = [{ name: 'kek' }, { name: 'hi' }];
  private userGroups: Array<Group>;

  constructor(
    private modalService: NgbModal,
    private model: KanbanModel
    ) {}

  ngOnInit() {
    this.newGroupName = '';
    this.newBoardName = '';
    this.userGroups = [];

    this.model.registerObserver(this);
    this.model.loadUserProfile();
  }

  public open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = 'Closed with: ${result}';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public newGroupButtonClick(content: string): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = 'Closed with: ${result}';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public createNewGroupButtonClick(): void {
    this.model.createNewGroup(this.newGroupName);
    this.newGroupName = '';
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

  public createGroupButtonClick(): void {

  }

  // create new PersonalBoard button
  public createPersonalBoardClick(): void {
    const newName = {
      name: this.newBoardName
    };
    this.personalDashboards.push(newName);
    this.newBoardName = '';
  }

  private isNewUserGroup(group: Group): boolean {
    for (let n = this.userGroups.length - 1; n >= 0; n--) {
      if (this.userGroups[n].getKey() === group.getKey()) {
        return false;
      }
    }

    return true;
  }

  update(user: User, group: Group): void {
    if (this.isNewUserGroup(group)) {
      this.userGroups.push(group);
    }
  }
}

