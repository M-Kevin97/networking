import { Component, OnInit, AfterViewInit, ElementRef, Renderer2, ViewChildren, QueryList, Input, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subject } from 'rxjs';
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
  @Input() rating:Rating;
  
  note:number;
  notes:number[] = [1,2,3,4,5];

  ratingForm: FormGroup;

  @ViewChildren('star') stars:QueryList< ElementRef>;
  
  get activeModal() {
    return this._NgbActiveModal;
  }

  constructor(private formBuilder:FormBuilder,
              private _NgbActiveModal: NgbActiveModal,
              private ratingService:RatingService,
              private renderer: Renderer2,
              private changeDetectorRef: ChangeDetectorRef) { 
  }

  ngOnInit() {

    this.ratingForm = this.formBuilder.group({
      title : ['',[Validators.required]],
      comment: ['',[Validators.required]],
    });
  }

  ngAfterViewInit() {

    this.fillForm();
    this.changeDetectorRef.detectChanges();
  }

  fillForm() {
    if(this.rating) {
      this.ratingForm.patchValue({
        title: this.rating.title,
        comment: this.rating.comment
      },{
        emitEvent: false
      });

      this.user = this.rating.user;
      this.course = this.rating.course;

      this.selectNote(this.rating.note);
    }
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

  shouldShowRequiredError(controlName:string) {

    return !this.ratingForm.get(controlName).valid && this.ratingForm.get(controlName).touched;
  }

  passBack(){

    console.log('passBack', this.note, this.course, this.user);

    if(this.note && this.course && this.user) { 

      if(this.rating) {

        console.log('passBack', this.rating);
        
        this.getRatingFormValues(this.rating);
  
        this.ratingService.updateRating(this.rating,
          (val) => {
            console.warn('close modal no val', val);
            if(val) {
              console.warn('close modal', val);
              this.activeModal.close(val);
            }
            // else display 'le commentaire n'a pas pu être enregistrer, veuillez réessayer'
          }
        );

      } else {
        this.rating = new Rating(null, null, null, null, null, null, null);

        this.getRatingFormValues(this.rating);
  
        this.ratingService.addRatingInDB(this.rating,
          (val) => {
            console.warn('close modal no val', val);
            if(val) {
              console.warn('close modal', val);
              this.activeModal.close(val);
            }
            // else display 'le commentaire n'a pas pu être enregistrer, veuillez réessayer'
          }
        );
      }
    }
  }

  private getRatingFormValues(rating:Rating) {

    rating.note = this.note;
    rating.title = this.ratingForm.get('title').value;
    rating.comment = this.ratingForm.get('comment').value;
    rating.user = this.user;
    rating.course = this.course;
  }
}

