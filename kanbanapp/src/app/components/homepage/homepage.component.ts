import { Component, OnInit, ComponentFactoryResolver, Injectable, Inject, ReflectiveInjector } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { DragulaService } from 'ng2-dragula';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent implements OnInit {
  groupsList: AngularFireList<any>;
  userId: string;
  closeResult: string;
  ref: any;
  newBoardName: string;
  // personalGroups: Array<any>;
  personalDashboards: Array<any> = [{ name: 'kek' }, { name: 'hi' }];
  userGroups: Array<any> = [];

  constructor(public afAuth: AngularFireAuth, private modalService: NgbModal, private db: AngularFireDatabase) {
    this.userId = afAuth.auth.currentUser.uid;
    this.groupsList = db.list('groups');
    this.ref = db.database.ref('groups');
    this.loadUserData();
  }


  private loadUserData(): void {
    let user$: any;

    this.db.object('users/' + this.userId).valueChanges()
      .subscribe(user => {
        user$ = user;
        console.log(user$);
        console.log(user$.groups);
        this.loadUserGroups(user$.groups);
      });
  }

  private loadUserGroups(groups: any[]): void {
    const groupSize = groups.length;
    let group$: any;

    for (let index = 0; index < groupSize; index++) {
      console.log(index + ' ' + groups[index]);
      this.db.object('groups/' + groups[index]).valueChanges()
        .subscribe(group => {
          group$ = group;
          this.userGroups.push(group$);
          // console.log('name' + group$.name);
        });
    }

  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = 'Closed with: ${result}';
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
    console.log('AAAAAAAAAAA');
  }

  privateBtn() {
    console.log('AAAAAAAAAAA');
  }

  create() {
    console.log('AAAAAAAAAAA');
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

  ngOnInit() {
    this.groupsList = this.db.list('groups');

    return this.groupsList.snapshotChanges();
  }

  // create new PersonalBoard button
  public createPersonalBoardClick(): void {
    const newName = {
      name: this.newBoardName
    };
    this.personalDashboards.push(newName);
    this.newBoardName = '';
  }
}

