import { Component, OnInit, Input } from '@angular/core';
import { Subject, Observable, timer } from 'rxjs';
import { map } from 'jquery';
import { get } from 'http';


@Component({
  selector: 'app-item-created',
  templateUrl: './item-created.component.html',
  styleUrls: ['./item-created.component.css']
})
export class ItemCreatedComponent implements OnInit {

  @Input() isCourse:boolean = false;
  @Input() isEvent:boolean = false;


  counterSubject = new Subject<boolean>();
  
  count = 6;

  // Methode servant à emettre les categories du service
  emitCounter(){
    this.counterSubject.next(true);
  }

  ngOnInit() {
    
    const countdownStart = 3;

  }

  constructor() {
  }
}
