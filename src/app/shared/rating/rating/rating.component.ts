import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {

  
  averageRating:number = 5;
  nbRatings:number = 21;
  @Input() style:number;

  constructor() { }

  ngOnInit() {
  }

}
