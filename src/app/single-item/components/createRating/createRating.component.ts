import { Component, OnInit, AfterViewInit, ElementRef, Renderer2, ViewChildren, QueryList, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ICourse } from 'src/app/shared/model/item/course';
import { Rating } from 'src/app/shared/model/rating/rating';
import { IUser } from 'src/app/shared/model/user/user';
import { RatingService } from 'src/app/shared/service/rating/rating.service';

@Component({
  selector: 'app-createRating',
  templateUrl: './createRating.component.html',
  styleUrls: ['./createRating.component.css']
})
export class CreateRatingComponent implements OnInit, AfterViewInit {
  
  @Input() course:ICourse;
  @Input() user:IUser;
  
  note:number;
  notes:number[] = [1,2,3,4,5];
  rating:Rating;
  ratingForm: FormGroup;

  @ViewChildren('star') stars:QueryList< ElementRef>;
  
  get activeModal() {
    return this._NgbActiveModal;
  }

  constructor(private formBuilder:FormBuilder,
              private _NgbActiveModal: NgbActiveModal,
              private ratingService:RatingService,
              private renderer: Renderer2) { 

    this.rating = new Rating(null, null, null, null, null);
  }

  ngOnInit() {

    console.log('ngOnInit rating course');

    this.ratingForm = this.formBuilder.group({
      comment: ['',[Validators.required]],
    });
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit rating course', this.stars);
  }


  selectNote(note:number) {

    var i:number = 0;
    this.stars.forEach(
      (element) => {
        i++;
        if(i <= note){
          this.renderer.setStyle(element.nativeElement, "color", "#fcc632");
        }
        else if(i > note){
          this.renderer.setStyle(element.nativeElement, "color", "#e2e3e4");
        }
      }
    );

    this.note = note;
  }

  passBack(){

    if(this.note && this.course && this.user) { 
      this.rating.note = this.note;
      this.rating.comment = this.ratingForm.get('comment').value;

      this.ratingService.saveRating(this.rating, this.course, this.user).then(
        (val) => {
          if(val) {
            this.activeModal.close(this.rating);
          }
        }
      );
    }
  }
}

