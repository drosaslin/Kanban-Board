import { Component, OnInit } from '@angular/core';
import { CardStore } from '../../card_store';
import { TableSchema } from '../../table_schema';

@Component({
  selector: 'app-project-board',
  templateUrl: './project-board.component.html',
  styleUrls: ['./project-board.component.css']
})

export class ProjectBoardComponent implements OnInit {
  cardStore: CardStore;
  tables: TableSchema[];

  constructor() { }

  ngOnInit() {
    this.setMockData();
  }

  setMockData(): void {
    this.cardStore = new CardStore();
    const tables: TableSchema[] = [
      {
        name: 'To Do',
        cards: []
      },
      {
        name: 'Doing',
        cards: []
      },
      {
        name: 'Done',
        cards: []
      }
    ];
    this.tables = tables;
  }

}
