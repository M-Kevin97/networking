import { AuthService } from 'src/app/core/auth/auth.service';
import { Component, OnInit, Input } from '@angular/core';
import { Rating } from 'src/app/shared/model/rating/rating';

@Component({
  selector: 'app-rating-list',
  templateUrl: './rating-list.component.html',
  styleUrls: ['./rating-list.component.css']
})
export class RatingListComponent implements OnInit {
  public get authService(): AuthService {
    return this._authService;
  }

  @Input() ratings: Rating[];

  durationPublicationDate:string = '';

  constructor(private _authService: AuthService) { }

  ngOnInit() { }

   displayDurationPublicationDate(index:number) {

    return new Date().getTime() - new Date(this.ratings[index].publicationDate).getTime();
    
  }

}
