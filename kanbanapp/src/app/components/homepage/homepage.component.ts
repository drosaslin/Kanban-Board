import { Component, OnInit, ComponentFactoryResolver, Injectable, Inject, ReflectiveInjector } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { DragulaService } from 'ng2-dragula';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})

export class HomepageComponent implements OnInit {

  closeResult: string;

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

  public createPersonalBoardClick(): void {
    const newName = {
      name: 'new board 2'
    };

    this.personalGroups.push(newName);
  }
}

