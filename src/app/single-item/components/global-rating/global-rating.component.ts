import { Component, OnInit, Input, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { Rating } from 'src/app/shared/rating/rating';

@Component({
  selector: 'app-global-rating',
  templateUrl: './global-rating.component.html',
  styleUrls: ['./global-rating.component.css']
})
export class GlobalRatingComponent implements OnInit, OnChanges {

  @Input() ratings:Rating[];

  globalNote:number = 0;
  oneStars:number = 0;
  twoStars:number = 0;
  threeStars:number = 0;
  fourStars:number = 0;
  fiveStars:number = 0;

  statStarOne:number;
  statStarTwo:number;
  statStarThree:number;
  statStarFour:number;
  statStarFive:number;

  constructor() { }

  ngOnInit() { 

    console.log('ratings', this.ratings);
    //this.sortRatings();
    //this.calculGlobalNote();
    console.log('getGlobalNote', this.globalNote);
  }

  ngOnChanges(changes: SimpleChanges) {
    //Insérez votre code de détection du changement ici
    this.sortRatings();
    this.globalNote = Rating.getGlobalNote(this.ratings)

    this.statStarOne = this.getGlobalNoteForStar(1);
    this.statStarTwo = this.getGlobalNoteForStar(2);
    this.statStarThree = this.getGlobalNoteForStar(3);
    this.statStarFour = this.getGlobalNoteForStar(4);
    this.statStarFive = this.getGlobalNoteForStar(5);
  }

  sortRatings() {
    if(!this.ratings) return;
    for(let rating of this.ratings) {
      switch(rating.note){
        case 1 :  {
          this.oneStars++;
          break;
        }
        case 2 :  {
          this.twoStars++;
          break;
        }
        case 3 :  {
          this.threeStars++;
          break;
        }
        case 4 :  {
          this.fourStars++;
          break;
        }
        case 5 :  {
          this.fiveStars++;
          break;
        }
      }
    }
  }

  getGlobalNoteForStar(note:number):number{

    var starStat:number;
    const totalRating = (this.oneStars+this.twoStars+this.threeStars+this.fourStars+this.fiveStars);

    switch(note){
      case 1 :  {
        if(this.oneStars===0) starStat = 0; 
        else starStat = (this.oneStars/totalRating);
        break;
      }
      case 2 :  {
        if(this.twoStars===0) starStat = 0; 
        else starStat = (this.twoStars/totalRating);
        break;
      }
      case 3 :  {
        if(this.threeStars===0) starStat = 0; 
        else starStat = (this.threeStars/totalRating);
        break;
      }
      case 4 :  {
        if(this.fourStars===0) starStat = 0; 
        else starStat = (this.fourStars/totalRating);
        break;
      }
      case 5 :  {
        if(this.fiveStars===0) starStat = 0; 
        else starStat = (this.fiveStars/totalRating);
        break;
      }
    }

    return Math.round(starStat*100);
  }

}