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
  
  contentCourseForm: FormGroup;

  constructor(private formBuilder:FormBuilder) { 

    this.contentCourseForm = this.formBuilder.group({
      modules: this.formBuilder.array([])
    });
  }

  ngOnInit() {

    this.oldCourseModules = Array.from(this.courseModules);

    // add the first module form
    this.modulesControls.push(this.newModuleForm());
    this.fillContentCourseForm()
  }

  /*  --------------------------------- Modules --------------------------------- */

  get modulesControls() : FormArray {
    return this.contentCourseForm.get('modules') as FormArray;
  }

  fillContentCourseForm() {
    
    if(this.courseModules) {

      console.warn('fillContentCourseForm', this.courseModules);

      // for each module, fill it and add a moduleForm 
      for (var i = 0; i < this.courseModules.length; i++) {
       
        // fill module form
        this.fillModuleForm(i);
        
        // add new module form
        this.modulesControls.push(this.newModuleForm());

        if(!this.courseModules[i].chapters) this.courseModules[i].chapters = [];

        // for each chapter, add a chapterForm and fill it and create the add chapterForm
        for (var j = 0; j < this.courseModules[i].chapters.length; j++) {

          // add a formGroup for ChapterControls
          this.getChapterControlsWithModuleIndex(i)
              .push(this.newChapterForm());

          // fill chapter form
          this.fillChapterForm(i,j);
        }

        // add a formGroup for ChapterControls
        this.getChapterControlsWithModuleIndex(i)
        .push(this.newChapterForm());
      }
    }
  }

  newModuleForm(): FormGroup {

    return this.formBuilder.group({
      titleModule: ['', [Validators.required]],
      descriptionModule: ['', [Validators.required]],
      chapters: this.formBuilder.array([]),
    });
  }

  // add the module form values in course content array 
  addModule() {

    const iLastModule = this.modulesControls.length-1;
    const lastModuleForm = this.modulesControls.controls[iLastModule];
    const titleM:string = lastModuleForm.get('titleModule').value;
    const descriptionM:string = lastModuleForm.get('descriptionModule').value;

    this.courseModules.push(new Module(null, titleM,
                                             descriptionM, 
                                             []));

    // add a formGroup for moduleControls
    this.modulesControls.push(this.newModuleForm());
    
    console.log('addModule', this.courseModules);

    // add a formGroup for ChapterControls
    this.getChapterControlsWithModuleIndex(iLastModule)
        .push(this.newChapterForm());

    console.log('addChapterForm', this.getChapterControlsWithModuleIndex(this.modulesControls.controls.length-1));
  }

  fillModuleForm(iModule:number) {

    console.warn('fillModuleForm', this.courseModules[iModule], this.modulesControls.controls.length);

    const modForms = this.modulesControls.controls[iModule];

    if(modForms){

      modForms.patchValue({
        titleModule: this.courseModules[iModule].title,
        descriptionModule: this.courseModules[iModule].description,
      });

      modForms.get('titleModule').disable();
      modForms.get('descriptionModule').disable();
    }
  }

  saveModule(iModule:number){

    console.log('updateModule', iModule);

    const moduleForm = this.modulesControls.controls[iModule];

    const titleM:string = moduleForm.get('titleModule').value;
    const descriptionM:string = moduleForm.get('descriptionModule').value;

    this.courseModules[iModule].title = titleM;
    this.courseModules[iModule].description = descriptionM;

    moduleForm.get('titleModule').disable();
    moduleForm.get('descriptionModule').disable();
  }


  moduleFormIsDisabled(iModule:number) :boolean{

    const moduleForm = this.modulesControls.controls[iModule];

    if(moduleForm) return moduleForm.get('titleModule').disabled && moduleForm.get('descriptionModule').disabled;
  
    return false;
  }

  updateModule(iModule:number) {
    console.log('updateModule', iModule);

    const moduleForm = this.modulesControls.controls[iModule];

    moduleForm.get('titleModule').enable();
    moduleForm.get('descriptionModule').enable();
  }

  removeModule(iModule:number) {

    if(this.courseModules[iModule]) 
    {
      let chapters = this.courseModules[iModule].chapters;
      if(chapters.length) {

        // clear chapter controls array of module control
        this.getChapterControlsWithModuleIndex(iModule).clear();

        // clear chapter elements array
        chapters.splice(0, chapters.length);
      }    
  
      // delete module control in modules formArray
      this.modulesControls.removeAt(iModule);

      // remove element in courseModules Array
      this.courseModules.splice(iModule, 1);

      // // if array is empty, add new form
      // if(!this.modulesControls.length && !this.courseModules.length) {
      //    // add a formGroup for moduleControls
      //   this.modulesControls.push(this.newModuleForm());
        
      //   // add a formGroup for ChapterControls
      //   this.getChapterControlsWithModuleIndex(this.modulesControls.length-1)
      //       .push(this.newChapterForm());
      // }
    }
  }

  shouldShowModuleRequiredError(iModule:number, controlName) {

    const moduleForm = this.modulesControls.controls[iModule] as FormGroup;

    return !moduleForm.get(controlName).valid && moduleForm.get(controlName).touched;
  }


  /*  --------------------------------- Chapters --------------------------------- */

  // get chapterControls in modulesControlsArray
  getChapterControlsWithModuleIndex(iModule:number) : FormArray {

    var md = this.modulesControls.controls[iModule] 
                  ? this.modulesControls.controls[iModule].get("chapters") as FormArray 
                  :  null;

    return md ? md : null;
  }

  newChapterForm(): FormGroup {
    return this.formBuilder.group({
      titleChapter: ['', [Validators.required]],
    });
  }

  addChapter(iModule:number) {

    let chapters = this.getChapterControlsWithModuleIndex(iModule);
    if(chapters) {

      const iChapter = chapters.length-1;

      console.log('this.chapters.length', iChapter, chapters);

      const titleC:string = chapters.controls[iChapter]
                                    .get('titleChapter').value;
  
      this.courseModules[iModule].chapters.push(new Chapter(null, titleC));

      chapters.controls[iChapter].get('titleChapter').disable();

      chapters.push(this.newChapterForm());
  
      console.log('addChapter', chapters);
      
    }
  }

  fillChapterForm(iModule:number, iChapter:number) {

    console.warn('fillChapterForm', this.courseModules[iModule].chapters[iChapter], 
                                    this.getChapterControlsWithModuleIndex(iModule).controls.length);

    if(this.modulesControls.controls[iModule]) {

      let chapterForms = this.getChapterControlsWithModuleIndex(iModule);

      if(chapterForms) {

        chapterForms.controls[iChapter].patchValue({
          titleChapter: this.courseModules[iModule].chapters[iChapter].title,
        });

        chapterForms.controls[iChapter].get('titleChapter').disable();
      }
    }
  }


  saveChapter(iModule:number, iChapter:number){

    let chapters = this.getChapterControlsWithModuleIndex(iModule);
    const titleC:string = chapters.controls[iChapter].get('titleChapter').value;

    console.log('updateChapter', iChapter, chapters, titleC);

    this.courseModules[iModule].chapters[iChapter].title = titleC;

    chapters.controls[iChapter].get('titleChapter').disable();
  }

  updateChapter(iModule:number, iChapter:number){

    let chapters = this.getChapterControlsWithModuleIndex(iModule);

    chapters.controls[iChapter].get('titleChapter').enable();
  }


  chapterFormIsDisabled(iModule:number, iChapter:number) :boolean{

    let chapters = this.getChapterControlsWithModuleIndex(iModule);
    if(chapters) return chapters.controls[iChapter].get('titleChapter').disabled;
  
    return false;
  }

  removeChapter(iModule:number, iChapter:number) {

    this.getChapterControlsWithModuleIndex(iModule).removeAt(iChapter);

    this.courseModules[iModule].chapters.splice(iChapter, 1);

  }

  
  shouldShowChapterRequiredError(iModule:number, iChapter:number, controlName) {

    let chapters = this.getChapterControlsWithModuleIndex(iModule);

    return !chapters.controls[iChapter].get(controlName).valid 
            && chapters.controls[iChapter].get(controlName).touched;
  }


  onSubmit() {
    console.log(this.contentCourseForm.value);
    //this.newCourseContentEvent.next(this.courseModules);
  }
}
