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
  taskDescription: string;
  taskComment: string;
  groups: Array<any>;

  constructor(private dragulaService: DragulaService, private modalService: NgbModal) {
    this.dragulaService.createGroup('COLUMNS', {
      direction: 'horizontal',
      moves: (el, source, handle) => handle.className === 'group-handle'
    });

    const group: Array<any> = [
      {
        name: 'To Do',
        items: [{name: 'Item A'}, {name: 'Item B'}, {name: 'Item C'}, {name: 'Item D'}],
        isAddTaskEnabled: false
      },
      {
        name: 'Doing',
        items: [{name: 'Item 1'}, {name: 'Item 2'}, {name: 'Item 3'}, {name: 'Item 4'}],
        isAddTaskEnabled: false
      }
    ];

    this.groups = group;
    this.setModalDefaultState();
  }

  ngOnInit() {
  }

  public openTaskModal(content, itemName) {
    this.setModalDefaultState();

    this.modalService.open(content, {size: 'lg', ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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
      return  `with: ${reason}`;
    }
  }

  public addTaskButtonClick(index): void {
    this.groups[index].isAddTaskEnabled = !this.groups[index].isAddTaskEnabled;
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

  private setModalDefaultState(): void {
    this.isDescriptionTextBoxEnabled = false;
  }

  private disableDescriptionTextBox(): void {
    this.isDescriptionTextBoxEnabled = false;
    this.isAddCommentButtonEnabled = false;
  }
}
