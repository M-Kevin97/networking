import { ItemService } from 'src/app/shared/service/item/item.service';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Module } from './../../../shared/model/item/module';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Chapter } from 'src/app/shared/model/item/chapter';

@Component({
  selector: 'app-edit-course-content',
  templateUrl: './edit-course-content.component.html',
  styleUrls: ['./edit-course-content.component.scss']
})
export class EditCourseContentComponent implements OnInit {

  @Input() courseModules:Module[] = [];
  oldCourseModules:Module[] = [];

  @Input() courseId:string = '';

  @Output() newCourseContentEvent = new EventEmitter<Module[]>();
  
  modulesForm: FormGroup;


  constructor(private formBuilder:FormBuilder,
              private itemService:ItemService) { 

    this.modulesForm = this.formBuilder.group({
      titleModule: ['', [Validators.required]],
      descriptionModule: ['', [Validators.required]],
      chapters: this.formBuilder.array([]),
    });
  }

  ngOnInit() {

    this.oldCourseModules = Array.from(this.courseModules);

  }

  /*  --------------------------------- Modules --------------------------------- */

  addModule() {

    this.courseModules.push(new Module(null, this.modulesForm.get('titleModule').value,
                                             this.modulesForm.get('descriptionModule').value, 
                                             []));

    console.log('addModule', this.courseModules);

    this.chapters.push(this.newChapter());

  }

  updateModule(i:number) {
    console.log('updateModule', i);

    const titleM:string = this.modulesForm.get('titleModule').value;
    const descriptionM:string = this.modulesForm.get('descriptionModule').value;

    this.courseModules[i].title = titleM;
    this.courseModules[i].description = descriptionM;
  }

  removeModule(i:number) {
    this.courseModules = this.courseModules.slice(i+1);
    this.chapters.clear();
    this.modulesForm.reset();
  }

  shouldShowModuleRequiredError(i:number, controlName) {

    return !this.modulesForm.get(controlName).valid && this.modulesForm.get(controlName).touched;
  }



  /*  --------------------------------- Chapters --------------------------------- */

  get chapters() : FormArray {
    return this.modulesForm.get("chapters") as FormArray;
  }

  newChapter(): FormGroup {
    return this.formBuilder.group({
      titleChapter: ['', [Validators.required]],
    });
  }

  addChapter() {
    const i = this.chapters.length-1;
    console.log('this.chapters.length', i, this.chapters);

    const titleC:string = this.chapters.controls[i].get('titleChapter').value;

    this.courseModules[0].chapters.push(new Chapter(null, titleC));

    console.log('addChapter', this.chapters);

    this.chapters.push(this.newChapter());
  }

  updateChapter(i:number){

    const titleC:string = this.chapters.controls[i].get('titleChapter').value;

    console.log('updateChapter', i, this.chapters, titleC);

    this.courseModules[0].chapters[i].title = titleC;
  }

  removeChapter(i:number) {
    this.chapters.removeAt(i);
    this.courseModules[0].chapters = this.courseModules[0].chapters.slice(i+1);
  }

  shouldShowChapterRequiredError(i:number, controlName) {

    return !this.chapters.controls[i].get(controlName).valid && this.chapters.controls[i].get(controlName).touched;
  }

  onSubmit() {
    console.log(this.modulesForm.value);
  }

  onSaveCourseContent() {
    if(this.oldCourseModules.length && this.courseModules.length) this.updateCourseContent();
    else if(!this.oldCourseModules.length && this.courseModules.length) this.createCourseContent();
  }

  private createCourseContent() {
    this.itemService.addCourseContent(this.courseModules, this.courseId, 
      (val:Module[]) => {
        this.courseModules = val;
        this.newCourseContentEvent.next(val);
        console.log('createCourseContent', JSON.stringify(val));
      }
    );
  }

  private updateCourseContent() {
    this.itemService.updateCourseContent(this.courseModules, this.courseId, 
      (val:Module[]) => {
        this.courseModules = val;
        this.newCourseContentEvent.next(val);
        console.log('updateCourseContent', JSON.stringify(val));
      }
    );
  }


}
