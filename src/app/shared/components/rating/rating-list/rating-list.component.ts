import { AuthService } from 'src/app/core/auth/auth.service';
import { Component, OnInit, Input, ViewChild, TemplateRef, Output, EventEmitter } from '@angular/core';
import { Rating } from 'src/app/shared/model/rating/rating';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateRatingComponent } from 'src/app/single-item/components/createRating/createRating.component';
import { RatingService } from 'src/app/shared/service/rating/rating.service';

@Component({
  selector: 'app-rating-list',
  templateUrl: './rating-list.component.html',
  styleUrls: ['./rating-list.component.css']
})
export class RatingListComponent implements OnInit {

  public get authService(): AuthService {
    return this._authService;
  }
  @ViewChild("ratingDeletingcontent") ratingDeletingModalContent: TemplateRef<any>;
  @Input() ratings: Rating[];
  @Output() newRatings:EventEmitter<boolean> = new EventEmitter();

  durationPublicationDate:string = '';

  constructor(private _authService: AuthService,
              private ratingService: RatingService,
              private modalService: NgbModal) { }

  ngOnInit() { }

   displayDurationPublicationDate(index:number) {

    return new Date().getTime() - new Date(this.ratings[index].publicationDate).getTime();
    
  }


  updateRatingCourseModal(rating:Rating) {

    if(this.authService.isAuth && rating.user.id === this.authService.authUser.id) {

      const modalRef = this.modalService.open(CreateRatingComponent);
      modalRef.componentInstance.course = rating.course;
      modalRef.componentInstance.user = rating.user;

      // to update a rating
      modalRef.componentInstance.rating = rating;

      modalRef.result.then((result:Rating) => {
        if (result) {
          rating = result;
          this.newRatings.next(true);
        }

      }).catch((error) => {
        console.log(error);
      });

    };
  }

  // to delete a rating the user have to confirm in a modal dialog (true => delete)
  deleteRating(rating:Rating, index:number) {
    if(this.authService.isAuth && rating.user.id === this.authService.authUser.id) {

      this.modalService.open(this.ratingDeletingModalContent).result.then(
        (result) => {
          if(result) {
            this.ratingService.removeRating(rating, 
              () => {
                this.ratings.splice(index,1);
                this.newRatings.next(true);
              }
            );
          }
        }
      );
    }
  }

}
