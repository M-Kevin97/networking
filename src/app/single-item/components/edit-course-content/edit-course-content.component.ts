import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Module } from './../../../shared/model/item/module';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit, OnChanges, SimpleChanges, ViewChildren, QueryList, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Chapter } from 'src/app/shared/model/item/chapter';
import { Course } from 'src/app/shared/model/item/course';

@Component({
  selector: 'app-edit-course-content',
  templateUrl: './edit-course-content.component.html',
  styleUrls: ['./edit-course-content.component.scss']
})
export class EditCourseContentComponent implements OnInit, OnChanges, AfterViewInit, AfterViewChecked {

  @Input() course:Course;

  @Input() courseId:string = '';
  
  contentCourseForm: FormGroup;

  @ViewChild('titleModule') titleModule:           ElementRef;
  @ViewChild('descriptionModule') descpModule:     ElementRef;
  @ViewChild('chapterModule') chapterModule:       ElementRef;
  @ViewChildren("chaptersModule") chaptersModule:  QueryList<ElementRef>;
  

  isTitModuleFocus:      boolean = false;
  isDescpModuleFocus:    boolean = false;
  isChapterModuleFocus:  boolean = false;
  isChaptersModuleFocus: boolean[] = [];

  oldTitleModule:       string = '';
  oldDescriptionModule: string = '';
  oldChapterModule:     string = '';

  activeModule:         Module;

  warningMessage:       string = "Veuillez Compléter le module avant de l'enregistrer";
  activeWarning:        boolean = false;

  constructor(private formBuilder:FormBuilder,
              private cdRef:ChangeDetectorRef) { 

    this.contentCourseForm = this.formBuilder.group({
      titleModule:        ['',[Validators.required]],
      descriptionModule:  ['',[Validators.required]],
      chapterModule:      [''],
    });
  }

  ngOnInit() {

    this.initActivePane();
  }

  ngAfterViewInit(): void {

    console.warn('ngAfterViewInit');
  
    this.activateFieldFocus('titleModule');
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {

    console.warn('ngOnChanges', changes);
    this.initActivePane();
  }

  private initActivePane() {

    if(this.course.modules && this.course.modules.length) this.activeModule = this.course.modules[0];
    else {
      this.course.modules = [];
      this.activeModule = null;
    }
  }

  /*  --------------------------------- content editable --------------------------------- */

  activateFieldFocus(fieldName:  string) {

    if(this.activeModule) {
      switch(fieldName) {
        case 'titleModule': {
  
          this.isTitModuleFocus = true; 
          this.oldTitleModule = this.activeModule.title;
          this.titleModule.nativeElement.focus();
          break;
        }
  
        case 'descriptionModule': {
  
          this.isDescpModuleFocus = true; 
          this.oldDescriptionModule = this.activeModule.description;
          this.descpModule.nativeElement.focus();
          break;
        }
  
        case 'chapterModule': {
  
          this.isChapterModuleFocus = true; 
          this.chapterModule.nativeElement.focus();
          break;
        }
      }
    }
  }

  desactivateFieldFocus(fieldName:  string) {

    switch(fieldName) {
      case 'titleModule': {

        if(!this.activeModule.title.length) 
          this.activeModule.title = this.oldTitleModule;

        this.isTitModuleFocus = false; 
        break;
      }

      case 'descriptionModule': {

        if(!this.activeModule.description.length) 
          this.activeModule.description = this.oldDescriptionModule;

        this.isDescpModuleFocus = false;
        break;
      }
    }
  }

  resetField(fieldName:  string) {

    this.activateFieldFocus(fieldName);
    switch(fieldName) {
      case 'titleModule': {

        this.activeModule.title = '';
        break;
      }

      case 'descriptionModule': {

        this.activeModule.description = '';
        break;
      }
    }
  }
  
  onAddModule() {

    // create a new module
    let module = new Module('', '', '', []);

    // add to the newCourseModules array
    this.course.modules.push(module);

    // the last module created is active
    this.activeModule = module;    
  }

  isLastModuleFilled() {

    const lastModule = this.course.modules[this.course.modules.length-1];

    if(!lastModule) return false;

    if(lastModule.title && lastModule.title.length 
        && lastModule.description && lastModule.description.length
        && lastModule.chapters && lastModule.chapters.length) return true;
    else return false;
  }


  isActiveModuleFilled() {

    if(this.activeModule.title && this.activeModule.title.length 
        && this.activeModule.description && this.activeModule.description.length
        && this.activeModule.chapters && this.activeModule.chapters.length) return true;
    else return false;
  }

  onDetectClick() {

    if(this.isActiveModuleFilled()) {

      if(!this.activeModule.title.length) {
        this.isDescpModuleFocus = false;
        this.activateFieldFocus('titleModule');
      }
      else if(!this.activeModule.description.length) {
        this.isTitModuleFocus = false; 
        this.activateFieldFocus('descriptionModule');
      }
      else if(!this.activeModule.chapters.length) {
        this.isChapterModuleFocus = false; 
        this.activateFieldFocus('chapterModule');
      }
    } else this.activateWarningMessage();

  }

  // only for titleModule
  onDetectTitleKeyDown(event) {

    if(event.which === 13) {

      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }

      if(this.activeModule.title.length) {

        this.isTitModuleFocus = false;
        this.isDescpModuleFocus = true;
        this.descpModule.nativeElement.focus();
      }
    }
  }

  onDisplayModule(module:Module) {

    this.activeModule = module;
  }

  onRemoveModule(module:  Module, moduleIndex:  number) {

    // if isn't the last module
    if(moduleIndex !== this.course.modules.length-1) {

      // supprimer le module et afficher celui au dessus
      if(module.chapters.length) {

        // clear chapter elements array
        module.chapters.splice(0, module.chapters.length);
      }    

      this.course.modules.splice(moduleIndex, 1);

      // remove element in courseModules Array
      this.course.modules.splice(moduleIndex, 1);
    }
  }

  // saveCourseContent() {
  //   if(this.courseModules.length) {
  //     if(this.isLastModuleFilled()) {
  //       this.courseModules = this.courseModules;
  //     }
  //     else {
  //       this.courseModules = this.courseModules.slice(0, this.courseModules.length-1);
  //     }

  //     console.warn('courseModule', this.courseModules);
  //   }
  // }

  activateWarningMessage() {

    this.activeWarning = true;
    setTimeout(() => this.activeWarning = false, 3000);
  }

  /*  --------------------------------- Chapters --------------------------------- */

  onAddChapter() {

    const chapterInput = this.contentCourseForm.get('chapterModule');

    if(chapterInput.value) {

      const chapter:Chapter = new Chapter('', chapterInput.value);
      this.activeModule.chapters.push(chapter);
      
      chapterInput.reset();

      // add bool
      this.isChaptersModuleFocus.push(false);
    }

  }

  onRemoveChapter(index :number) {

    if(this.activeModule.chapters.length) {

      // remove element in chapters Array
      this.activeModule.chapters.splice(index, 1);
      this.isChaptersModuleFocus.splice(index, 1);
    }
  }

  onActivateChapter(index:number){

    if(index > -1) {

      this.isChaptersModuleFocus[index] = true;
      this.oldChapterModule = this.activeModule.chapters[index].title;
      this.chaptersModule.toArray()[index].nativeElement.focus();
    }
  }

  onDesactivateChapter(index:number){

    let chapterText = this.activeModule.chapters[index].title;

    if(!chapterText.length) this.activeModule.chapters[index].title = this.oldChapterModule;

    this.isChaptersModuleFocus[index] = false;
  }

  onDetectAddChapterKeyDown(event) {

    if(event.which === 13) {

      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }

      this.onAddChapter();
    }
  }

  onDetectSetChapterKeyDown(event, index:number) {

    if(event.which === 13 && event.code === 'Enter') {

      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }

      this.onDesactivateChapter(index);
      if(index < this.activeModule.chapters.length-1) this.onActivateChapter(index+1);
      else this.chapterModule.nativeElement.focus();
    }
  }
}
