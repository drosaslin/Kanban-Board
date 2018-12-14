import { Component, OnInit } from '@angular/core';
import { DragulaService } from 'ng2-dragula';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  closeResult: string;
  groups: Array<any> = [
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

  constructor(private dragulaService: DragulaService, private modalService: NgbModal) {
    this.dragulaService.createGroup('COLUMNS', {
      direction: 'horizontal',
      moves: (el, source, handle) => handle.className === 'group-handle'
    });
  }

  ngOnInit() {
  }

  public open(content, itemName) {
    console.log(itemName);
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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

  private addTaskButtonClick(index): void {
    this.groups[index].isAddTaskEnabled = !this.groups[index].isAddTaskEnabled;
  }

  private addTableButtonClick(): void {
    this.groups.push({
      name: 'New Table',
      items: [],
      isAddTaskEnabled: false
    });
  }
}
