import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Module } from 'src/app/shared/model/item/module';

@Component({
  selector: 'app-edit-course-content-modal',
  templateUrl: './edit-course-content-modal.component.html',
  styleUrls: ['./edit-course-content-modal.component.scss']
})
export class EditCourseContentModalComponent implements OnInit {

  @Input() courseContent:Module[] = [];
  oldCourseContent:Module[] = [];

  @Input() courseId:string = '';

  constructor(private _NgbActiveModal: NgbActiveModal) { }
  
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
  passBack(){

    this.activeModal.close(this.courseContent);
  }

}
