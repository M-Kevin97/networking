import { Component, Input, OnInit } from '@angular/core';
import { Course } from 'src/app/shared/model/item/course';
import { EventItem } from 'src/app/shared/model/item/event-item';
import { Item } from 'src/app/shared/model/item/item';

@Component({
  selector: 'app-edit-tags',
  templateUrl: './edit-tags.component.html',
  styleUrls: ['./edit-tags.component.scss']
})
export class EditTagsComponent implements OnInit {

  @Input() item:  Course | Item | EventItem;

  constructor() { }

  ngOnInit() {
  }

}
