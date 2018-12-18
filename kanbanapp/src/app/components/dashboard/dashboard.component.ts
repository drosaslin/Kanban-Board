import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  isAddCommentButtonEnabled: boolean;
  isDescriptionTextBoxEnabled: boolean;
  closeResult: string;
  taskName: string;
  taskDescription: string;
  taskComment: string;
  groups: Array<any>;

  constructor(
    private dragulaService: DragulaService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.dragulaService.createGroup('COLUMNS', {
      direction: 'horizontal',
      moves: (el, source, handle) => handle.className === 'group-handle'
    });

    const group: Array<any> = [
      {
        name: 'To Do',
        items: [{ name: 'Item A' }, { name: 'Item B' }, { name: 'Item C' }, { name: 'Item D' }],
        isAddTaskEnabled: false
      },
      {
        name: 'Doing',
        items: [{ name: 'Item 1' }, { name: 'Item 2' }, { name: 'Item 3' }, { name: 'Item 4' }],
        isAddTaskEnabled: false
      }
    ];

    this.groups = group;
    this.setModalDefaultState();
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
    this.groups.push({
      name: 'New Table',
      items: [],
      isAddTaskEnabled: false
    });
  }

  public deleteTableButtonClick(tableName): void {
    for (let n = 0; n < this.groups.length; n++) {
      if (this.groups[n].name === tableName) {
        this.groups.splice(n, 1);
        break;
      }
    }
  }

  public addTaskButtonClick(index): void {
    const newItem = {
      name: this.taskName
    };

    if (this.groups[index].isAddTaskEnabled) {
      this.groups[index].items.push(newItem);
    }

    this.groups[index].isAddTaskEnabled = !this.groups[index].isAddTaskEnabled;
    this.taskName = '';
  }

  public descriptionTextBoxClick(): void {
    if (!this.isDescriptionTextBoxEnabled) {
      this.isDescriptionTextBoxEnabled = true;
    }
  }

  public saveDescriptionClick(): void {
    this.disableDescriptionTextBox();
  }

  public closeDescriptionClick(): void {
    this.disableDescriptionTextBox();
  }

  public deleteCommentButtonClick(): void {
    console.log('delete comment');
  }

  public commentTextBoxChange(): void {
    this.isAddCommentButtonEnabled = this.taskComment.length > 0;
  }

  private setModalDefaultState(): void {
    this.isDescriptionTextBoxEnabled = false;
  }

  private disableDescriptionTextBox(): void {
    this.isDescriptionTextBoxEnabled = false;
    this.isAddCommentButtonEnabled = false;
  }
}
