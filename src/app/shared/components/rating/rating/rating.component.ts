import { Rating } from 'src/app/shared/model/rating/rating';
import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit, OnChanges {


  @Input() style:number;
  @Input() nbRatings:number = 0;
  @Input() globalNote:number = 0;
  @Input() size:number = 1.6;

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    //Insérez votre code de détection du changement ici

  }

}
