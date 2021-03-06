import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { IObserver } from '../../kanban-model/interfaces/iobserver';
import { DragulaService } from 'ng2-dragula';
import { ActivatedRoute, Router } from '@angular/router';
import { KanbanModel } from '../../kanban-model/model';
import { Group } from 'src/app/kanban-model/classes/group';
import { User } from 'src/app/kanban-model/classes/user';
import { Subscription } from 'rxjs';
import { Task } from 'src/app/kanban-model/classes/task';
import { TaskComment } from 'src/app/kanban-model/classes/task_comment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit, OnDestroy, IObserver {
  private dashboardId: string;
  private groupId: string;

  tempDescription: string;
  isAddCommentButtonEnabled: boolean;
  isDescriptionTextBoxEnabled: boolean;
  editText: string;
  closeResult: string;
  taskName: string;
  taskDescription: string;
  taskComment: string;
  columnTempName: string;
  isEditTableTextBoxEnabled: Map<string, boolean>;
  addTaskEnabler: Map<string, boolean>;
  dragulaSub: any;
  currentTask: Task;
  currentSelectedColumn: string;

  constructor(
    private dragulaService: DragulaService,
    private modalService: NgbModal,
    private activateRoute: ActivatedRoute,
    private router: Router,
    public model: KanbanModel
  ) { }

  ngOnInit() {
    this.dragulaSub = new Subscription();
    this.tempDescription = '';
    this.currentTask = null;
    this.columnTempName = '';
    this.editText = 'Edit';
    this.currentSelectedColumn = '';
    this.model.columnsSubscription = null;
    this.model.selectedDashboard = null;
    this.groupId = this.activateRoute.snapshot.paramMap.get('groupId');
    this.dashboardId = this.activateRoute.snapshot.paramMap.get('dashboardId');
    this.model.registerObserver(this);
    this.model.loadUserProfile();
    this.setDefaultState();
    this.setModalDefaultState();
    this.setupDragula();
  }

  ngOnDestroy() {
    console.log('dashboard destroyed');
    console.log(this.currentTask);

    this.dragulaService.destroy('COLUMNS');
    this.groupId = '';
    this.dashboardId = '';
    this.dragulaSub.unsubscribe();
    this.model.setModelDefaultState();
  }

  public openTaskModal(content, taskId) {
    this.setModalDefaultState();

    for (let n = 0; n < this.model.selectedDashboard.tasks.length; n++) {
      if (this.model.selectedDashboard.tasks[n].key === taskId) {
        this.currentTask = this.model.selectedDashboard.tasks[n];
        console.log(this.currentTask);
      }
    }

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

  public deleteTableButtonClick(content: string, columnId: string): void {
    this.currentSelectedColumn = columnId;

    this.modalService.open(content, { size: 'sm', ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  public deleteTable(): void {
    this.model.deleteColumn(this.currentSelectedColumn);
    this.currentSelectedColumn = '';
    this.closeModal();
  }

  public groupNameButtonClick(): void {
    this.router.navigate(['groupManagement', this.groupId]);
  }

  public addTaskButtonClick(columnId: string): void {
    if (this.addTaskEnabler[columnId] && this.taskName !== '') {
      this.model.createNewTask(columnId, this.taskName);
    }

    this.addTaskEnabler[columnId] = !this.addTaskEnabler[columnId];
    this.taskName = '';
  }

  // Enables the description's textbox if it is disabled
  public descriptionTextBoxClick(): void {
    if (!this.isDescriptionTextBoxEnabled) {
      this.isDescriptionTextBoxEnabled = true;
      this.tempDescription = this.currentTask.description;
    }
  }

  // Saves the description and disables the description's textbox
  public saveDescriptionClick(): void {
    this.model.updateTaskDescription(this.currentTask.description, this.currentTask.key);
    this.disableDescriptionTextBox();
    this.tempDescription = '';
  }

  // Disables the description's textbox
  public closeDescriptionClick(): void {
    this.currentTask.description = this.tempDescription;
    this.tempDescription = '';
    this.disableDescriptionTextBox();
  }

  public closeModal(): void {
    this.modalService.dismissAll();
  }

  // Delete comment from comment box
  public deleteCommentButtonClick(): void {
    console.log('delete comment');
  }

  public addCommentButtonClick(): void {
    console.log(this.taskComment);
    this.model.addTaskComment(this.taskComment, this.model.user.getFirstName(), this.model.user.getLastName(),
      this.model.user.getKey(), this.currentTask.key);

    this.taskComment = '';
    this.commentTextBoxChange();
  }

  public isOnTime(date: any): boolean {
    const givenDate = date.year + '-' + date.month + '-' + date.day;
    const dueDate = new Date(givenDate);
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    return currentDate < dueDate;
  }

  // Enables the add comment button if there is any input in the comment's textox
  public commentTextBoxChange(): void {
    this.isAddCommentButtonEnabled = (this.taskComment.length > 0);
  }

  public dateChange(): void {
    this.model.addTaskDueDate(this.currentTask.dueDate, this.currentTask.key);
    console.log(this.currentTask.dueDate);
  }

  public cancelEditColumnButtonClick(columnKey: string): void {
    this.isEditTableTextBoxEnabled[columnKey] = false;
  }

  public editTableButtonClick(columnKey: string, name: string): void {
    if (this.isEditTableTextBoxEnabled[columnKey]) {
      this.model.updateColumnName(columnKey, this.columnTempName);
      this.editText = 'Edit';
      this.columnTempName = '';
    } else {
      this.columnTempName = name;
      this.editText = 'Save';
    }

    this.isEditTableTextBoxEnabled[columnKey] = !this.isEditTableTextBoxEnabled[columnKey];
  }

  private setDefaultState(): void {
    if (this.model.selectedDashboard != null) {
      const size = this.model.selectedDashboard.columns.length;
      this.addTaskEnabler = new Map();
      this.isEditTableTextBoxEnabled = new Map();

      for (let n = 0; n < size; n++) {
        this.isEditTableTextBoxEnabled.set(this.model.selectedDashboard.columns[n].key, false);
        this.addTaskEnabler.set(this.model.selectedDashboard.columns[n].key, false);
      }
    }
  }

  private setupDragula(): void {
    this.dragulaService.createGroup('COLUMNS', {
      direction: 'horizontal',
      moves: (el, source, handle) => handle.className === 'group-handle'
    });

    this.dragulaSub.add(this.dragulaService.dropModel('COLUMNS')
      .subscribe(({ targetModel }) => {
        this.model.updateColumnOrder(targetModel);
      })
    );

    this.dragulaSub.add(this.dragulaService.dropModel('ITEMS')
      .subscribe(({ target, item }) => {
        this.model.updateTaskColumn(target.id, item.key);
      })
    );
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

  public update(user: User, group: Group[]): void {
    this.model.retrieveGroupById(this.groupId);
    this.model.retrieveDashboardById(this.dashboardId);
    this.model.loadDashboardColumns(this.dashboardId);
    this.model.loadDashboardTasks(this.dashboardId);
    this.setDefaultState();
  }
}
