import { Component, HostListener, Input, OnInit } from '@angular/core';
import { TableSchema } from '../../table_schema';
import { CardStore } from '../../card_store';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit {
  @Input() table: TableSchema;
  @Input() cardStore: CardStore;
  displayAddCard = false;

  constructor() { }
  toggleDisplayAddCard() {
    this.displayAddCard = ! this.displayAddCard;
  }
  ngOnInit(): void {
  }

  allowDrop($event) {
    $event.preventDefault();
  }

  drop($event) {
    $event.preventDefault();
    const data = $event.dataTransfer.getData('text');

    let target = $event.target;
    const targetClassName = target.className;

    while (target.className !== 'table') {
      target = target.parentNode;
    }
    target = target.querySelector('.cards');

    if (targetClassName === 'card') {
      $event.target.parentNode.insertBefore(document.getElementById(data), $event.target);
    } else if (targetClassName === 'table__title') {
      if (target.children.length) {
        target.insertBefore(document.getElementById(data), target.children[0]);
      } else {
        target.appendChild(document.getElementById(data));
      }
    } else {
      target.appendChild(document.getElementById(data));
    }
  }

  onEnter(value: string) {
    const cardId = this.cardStore.newCard(value);
    this.table.cards.push(cardId);
  }
}
