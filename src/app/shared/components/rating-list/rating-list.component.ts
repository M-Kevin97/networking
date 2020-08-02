import { Component, OnInit, Input } from '@angular/core';
import { Rating } from '../../rating/rating';

@Component({
  selector: 'app-rating-list',
  templateUrl: './rating-list.component.html',
  styleUrls: ['./rating-list.component.css']
})
export class RatingListComponent implements OnInit {

  @Input() ratings: Rating[];

  constructor() { }

  ngOnInit() {
  }

}
