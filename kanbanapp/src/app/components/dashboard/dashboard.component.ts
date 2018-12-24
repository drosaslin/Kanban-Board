import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IObserver } from '../../kanban-model/interfaces/iobserver';
import { DragulaService } from 'ng2-dragula';
import { ActivatedRoute, Router } from '@angular/router';
import { KanbanModel } from '../../kanban-model/model';
import { Group } from 'src/app/kanban-model/classes/group';
import { User } from 'src/app/kanban-model/classes/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, OnDestroy, IObserver {
  private dashboardId: string;
  private groupId: string;

  isAddCommentButtonEnabled: boolean;
  isDescriptionTextBoxEnabled: boolean;
  closeResult: string;
  taskName: string;
  taskDescription: string;
  taskComment: string;
  addTaskEnabler: Map<string, boolean>;
  columns: Array<any>;

  constructor(
    private dragulaService: DragulaService,
    private modalService: NgbModal,
    private activateRoute: ActivatedRoute,
    private router: Router,
    private model: KanbanModel
  ) { }

  ngOnInit() {
    this.model.columnsSubscription = null;
    this.model.selectedDashboard = null;
    this.groupId = this.activateRoute.snapshot.paramMap.get('groupId');
    this.dashboardId = this.activateRoute.snapshot.paramMap.get('dashboardId');
    console.log('init', this.dashboardId);
    this.model.registerObserver(this);
    this.model.loadUserProfile();
    this.setAddTaskEnablers();
    // this.updateColumns();

    this.dragulaService.createGroup('COLUMNS', {
      direction: 'horizontal',
      moves: (el, source, handle) => handle.className === 'group-handle'
    });

    this.setModalDefaultState();
  }

  ngOnDestroy() {
    this.dragulaService.destroy('COLUMNS');
    this.groupId = '';
    this.dashboardId = '';
    // this.model.columnsSubscription.unsubscribe();
    // this.model.columnsSubscription = null;
    // this.model.selectedDashboard = null;
  }

  public openTaskModal(content, itemName) {
    this.setModalDefaultState();

    this.modalService.open(content, { size: 'lg', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  public addTableButtonClick(): void {
    this.model.createNewColumn('New Table');
  }

  public deleteTableButtonClick(columnId: string): void {
    this.model.deleteColumn(columnId);
  }

  public groupNameButtonClick(): void {
    this.router.navigate(['groupManagement', this.groupId]);
  }

  public addTaskButtonClick(columnId: string): void {
    // if (this.addTaskEnabler[columnId]) {
    //   this.model.addTaskToColumn(columnId);
    // }

    this.addTaskEnabler[columnId] = !this.addTaskEnabler[columnId];
    this.taskName = '';
  }

  // Enables the description's textbox if it is disabled
  public descriptionTextBoxClick(): void {
    if (!this.isDescriptionTextBoxEnabled) {
      this.isDescriptionTextBoxEnabled = true;
    }
  }

  // Saves the description and disables the description's textbox
  public saveDescriptionClick(): void {
    this.disableDescriptionTextBox();
  }

  // Disables the description's textbox
  public closeDescriptionClick(): void {
    this.disableDescriptionTextBox();
  }

  // Delete comment from comment box
  public deleteCommentButtonClick(): void {
    console.log('delete comment');
  }

  // Enables the add comment button if there is any input in the comment's textox
  public commentTextBoxChange(): void {
    this.isAddCommentButtonEnabled = (this.taskComment.length > 0);
  }

  private setAddTaskEnablers(): void {
    if (this.model.selectedDashboard != null) {
      const size = this.model.selectedDashboard.columns.length;
      this.addTaskEnabler = new Map();

      for (let n = 0; n < size; n++) {
        this.addTaskEnabler.set(this.model.selectedDashboard.columns[n].key, false);
      }
    }
  }

  // Set the default state of the task's modal
  private setModalDefaultState(): void {
    this.isDescriptionTextBoxEnabled = false;
    this.isAddCommentButtonEnabled = false;
  }

  // Disable the description text box
  private disableDescriptionTextBox(): void {
    this.isDescriptionTextBoxEnabled = false;
  }

  // private updateColumns(): void {
  //   const columnsSize = this.model.selectedDashboard.columns.length;
  //   const tasksSize = this.model.selectedDashboard.tasks.length;
  //   this.columns = [];
  //   let column: any[] = [];
  //   let tasks: any[] = [];

  //   for (let n = 0; n < columnsSize; n++) {
  //     for (let i = 0; i < tasksSize; i++) {
  //       if (this.model.selectedDashboard.tasks[i].dashboardId === this.model.selectedDashboard.columns[n].key) {
  //         tasks.push({
  //           content: this.model.selectedDashboard.tasks[i].content
  //         });
  //       }
  //     }
  //     column.push({
  //       name: this.model.selectedDashboard.columns[n].name,
  //       items: tasks
  //     });

  //     this.columns.push(column);
  //     column = [];
  //     tasks = [];
  //   }

  //   // console.log(this.columns);
  // }

  public update(user: User, group: Group[]): void {
    this.model.retrieveGroupById(this.groupId);
    this.model.retrieveDashboardById(this.dashboardId);
    this.model.loadDashboardColumns(this.dashboardId);
    // this.model.loadDashboardTasks(this.dashboardId);
    this.setAddTaskEnablers();
    // this.updateColumns();
    // console.log(this.model.selectedDashboard.columns);
    // console.log('update', this.model.selectedDashboard.key);
    // console.log(this.model.selectedDashboard.columns);
  }
}
