import { Component, OnInit, ComponentFactoryResolver, Injectable, Inject, ReflectiveInjector } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DragulaService } from 'ng2-dragula';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent implements OnInit {

  closeResult: string;

  newBoardName: string;

  personalGroups: Array<any> = [
    {
      name: 'new board',
    }
  ];

  constructor(private modalService: NgbModal) {
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
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
  }

  // create new PersonalBoard button
  public createPersonalBoardClick(): void {
    const newName = {
      name: this.newBoardName
    };
    this.personalGroups.push(newName);
    this.newBoardName = '';
  }
}

