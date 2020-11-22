import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Module } from './../../../shared/model/item/module';
import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, AfterViewInit, OnChanges, SimpleChanges, ViewChildren, QueryList } from '@angular/core';
import { Chapter } from 'src/app/shared/model/item/chapter';

@Component({
  selector: 'app-edit-course-content',
  templateUrl: './edit-course-content.component.html',
  styleUrls: ['./edit-course-content.component.scss']
})
export class EditCourseContentComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() courseModules:Module[] = [];
  newCourseModules:Module[] = [];

  @Input() courseId:string = '';

  @Output() newCourseContentEvent = new EventEmitter<Module[]>();
  
  contentCourseForm: FormGroup;

  @ViewChild('titleModule') titleModule:ElementRef;
  @ViewChild('descriptionModule') descpModule:ElementRef;
  @ViewChild('chapterModule') chapterModule:ElementRef;
  @ViewChildren("chaptersModule") chaptersModule: QueryList<ElementRef>;
  

  isTitModuleFocus: boolean = false;
  isDescpModuleFocus: boolean = false;
  isChapterModuleFocus: boolean = false;
  isChaptersModuleFocus: boolean[] = [];

  oldTitleModule: string = '';
  oldDescriptionModule: string = '';
  oldChapterModule: string = '';

  activeModule:Module;

  warningMessage:string = "Veuillez Compléter le module avant de l'enregistrer";
  activeWarning:boolean = false;

  constructor(private formBuilder:FormBuilder) { 

    this.contentCourseForm = this.formBuilder.group({
      titleModule:        ['',[Validators.required]],
      descriptionModule:  ['',[Validators.required]],
      chapterModule:      [''],
    });
  }

  ngOnInit() {

    this.setNewCourseModules();
  }

  ngAfterViewInit(): void {

    console.warn('ngAfterViewInit');
  
    this.activateFieldFocus('titleModule');
  }

  ngOnChanges(changes: SimpleChanges): void {

    console.warn('ngOnChanges', changes);
    this.setNewCourseModules();
  }

  private setNewCourseModules() {
    if(this.courseModules && this.courseModules.length) {

      this.newCourseModules = Array.from(this.courseModules);
      this.activeModule = this.newCourseModules[0];

    } else {

      this.newCourseModules = [];
      this.newCourseModules.push(new Module('', '', '', []));
      this.activeModule = this.newCourseModules[0];
    }

    this.isTitModuleFocus = true;
  }


  /*  --------------------------------- content editable --------------------------------- */

  activateFieldFocus(fieldName:  string) {

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
  
  onAddModule2() {

    // create a new module
    let module = new Module('', '', '', []);

    // add to the newCourseModules array
    this.newCourseModules.push(module);

    // the last module created is active
    this.activeModule = module;    
    
    // activate titleModule
    this.isTitModuleFocus = true;
    this.titleModule.nativeElement.focus();
  }

  isLastModuleFilled() {

    const lastModule = this.newCourseModules[this.newCourseModules.length-1];

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
    if(moduleIndex !== this.newCourseModules.length-1) {

      // supprimer le module et afficher celui au dessus
      if(module.chapters.length) {

        // clear chapter elements array
        module.chapters.splice(0, module.chapters.length);
      }    

      // remove element in courseModules Array
      this.newCourseModules.splice(moduleIndex, 1);
    }
  }

  saveCourseContent() {
    if(this.newCourseModules.length) {
      if(this.isLastModuleFilled()) {
        this.courseModules = this.newCourseModules;
      }
      else {
        this.courseModules = this.newCourseModules.slice(0, this.newCourseModules.length-1);
      }
    }
  }

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
