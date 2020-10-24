import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Module } from 'src/app/shared/model/item/module';
import { ItemService } from 'src/app/shared/service/item/item.service';

@Component({
  selector: 'app-edit-course-content-modal',
  templateUrl: './edit-course-content-modal.component.html',
  styleUrls: ['./edit-course-content-modal.component.scss']
})
export class EditCourseContentModalComponent implements OnInit {

  @Input() courseContent:Module[] = [];
  oldCourseContent:Module[] = [];

  @Input() courseId:string = '';

  constructor(private _NgbActiveModal: NgbActiveModal,
              private itemService:ItemService) { }
  
  get activeModal() {
    return this._NgbActiveModal;
  }

  ngOnInit() {

    if(!this.courseContent){
      this.courseContent = [];
    }
    this.oldCourseContent = Array.from(this.courseContent);
  }

  /**
   * Methode permettant d'envoyer à au component ayant appeler EDITSKILL,
   * de récuper les valeurs saisies
   * */ 
  private passBack(){

    this.activeModal.close(this.courseContent);
  }

  saveCourseContent() {
    if(this.oldCourseContent.length && this.courseContent.length) this.updateCourseContent();
    else if(!this.oldCourseContent.length && this.courseContent.length) this.createCourseContent();
  }

  private createCourseContent() {
    this.itemService.addCourseContent(this.courseContent, this.courseId, 
      (val:Module[]) => {

        // clear chapter elements array
        this.courseContent.splice(0, this.courseContent.length);
        this.courseContent = val;

        console.log('createCourseContent', val);

        this.passBack()
      }
    );
  }

  private updateCourseContent() {
    this.itemService.updateCourseContent(this.courseContent, this.courseId, 
      (val:Module[]) => {
        this.courseContent.splice(0, this.courseContent.length);
        this.courseContent = val;

        console.log('updateCourseContent', val);

        this.passBack()
      }
    );
  }

}
