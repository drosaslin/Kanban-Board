import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/dataservice';
import { Group } from '../../kanban-model/classes/group';
import { KanbanModel } from 'src/app/kanban-model/model';
import { IObserver } from '../../kanban-model/interfaces/iobserver';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { AngularFireDatabase } from 'angularfire2/database';
import { User } from 'src/app/kanban-model/classes/user';
import { ActivatedRoute, Router } from '@angular/router';
import {Observable} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

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
  usersList: Array<string>;
  searchInput: any;

  userType = 'Member';
  constructor(
    private selectedItems: DataService,
    private modalService: NgbModal,
    private model: KanbanModel,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.groupId = this.route.snapshot.paramMap.get('groupId');
    this.model.loadUserProfile();
    this.model.registerObserver(this);
    this.model.retrieveGroupById(this.groupId);

    this.newDashboardName = '';
    this.usersList = this.model.usersList;
    console.log(this.usersList);
    // console.log(this.model.selectedGroup);
    // console.log(this.model.selectedGroup.getAdmins());
  }

  search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      map(term => term.length < 2 ? []
        : this.usersList.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10))
    )

  public newDashboardButtonClick(content: string): void {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      // this.closeResult = 'Closed with: ${result}';
      // this.setDefaultCurrentSelectedGroup();
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public dashboardButtonClick(dashboardId: string): void {
    this.router.navigate(['dashboard', this.groupId, dashboardId]);
  }

  public createDashboardButtonClick(): void {
    this.model.createNewDashboard(this.newDashboardName, this.groupId);
    this.newDashboardName = '';
  }

  public update(user: User, group: Group[]): void {
    this.model.retrieveGroupById(this.groupId);
  }
}
