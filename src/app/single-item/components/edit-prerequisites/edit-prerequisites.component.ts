import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Course } from 'src/app/shared/model/item/course';

@Component({
  selector: 'app-edit-prerequisites',
  templateUrl: './edit-prerequisites.component.html',
  styleUrls: ['./edit-prerequisites.component.scss']
})
export class EditPrerequisitesComponent implements OnInit, OnChanges, AfterViewChecked {

  @Input() course:  Course;
  prerequisiteItemForm:  FormGroup;

  @ViewChild('prerequisiteInput') prerequisiteInput:ElementRef;
  @ViewChildren("prerequisitesInput") prerequisitesInput: QueryList<ElementRef>;

  isPrerequisiteInputFocus:boolean = true;
  isPrerequisiteSavedFocus:boolean[] = [];

  oldPrerequisite:string = '';

  constructor(private formBuilder:  FormBuilder,
              private cdRef:  ChangeDetectorRef) { }

  ngOnInit() {

    this.prerequisiteItemForm = this.formBuilder.group({
      prerequisiteInput: [''],
    });

    if(!this.course.prerequisites) this.course.prerequisites = [];
    else if(this.course.prerequisites && this.course.prerequisites.length) 
      this.course.prerequisites = this.course.prerequisites.reverse();
  }

  ngOnChanges(changes: SimpleChanges): void {

    if(!this.course.prerequisites) this.course.prerequisites = [];
    else if(this.course.prerequisites && this.course.prerequisites.length) 
      this.course.prerequisites = this.course.prerequisites.reverse();
  }

  ngAfterViewChecked() {

    this.cdRef.detectChanges();
  }

    /**
   * Methode permettant d'ajouter dans la liste des prérequis,
   * la compétence saisie dans l'input prerequisite
   * */ 
  onAddPrerequisite() {

    const prerequisite = this.prerequisiteItemForm.get('prerequisiteInput');

    if(prerequisite.value){

      this.course.prerequisites.unshift(prerequisite.value);
      this.isPrerequisiteSavedFocus.unshift(false);
      prerequisite.reset();
    }
  }

  /**
   * Methode permettant d'ajouter dans la liste des prérequis,
   * la compétence saisie dans l'input prerequisite
   * */ 
  onRemovePrerequisite(index:number) {
 
    if (index > -1) {

      this.course.prerequisites.splice(index,1);
      this.isPrerequisiteSavedFocus.splice(index,1);
    } 
  }

  /**
   * Prerequisite Input
   */

  onDetectAddPrerequisiteKeyDown(event) {

    if(event.which === 13) {

      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }

      this.onAddPrerequisite();
    }
  }

  /**
   *  PrerequisitesCourse
   */


  onActivatePrerequisite(index:number){

    if(index > -1) {

      this.isPrerequisiteSavedFocus[index] = true;
      this.oldPrerequisite = this.prerequisitesInput.toArray()[index].nativeElement.textContent;

      this.prerequisitesInput.toArray()[index].nativeElement.focus();
    }
  }

  onDesactivatePrerequisite(index:number){

    if(index > -1) {

      let prerequisiteText = this.prerequisitesInput.toArray()[index].nativeElement.textContent;

      if(!prerequisiteText.length) this.course.prerequisites[index] = this.oldPrerequisite;
  
      this.isPrerequisiteSavedFocus[index] = false;
    }
  }

  onDetectSetPrerequisiteSavedKeyDown(event, index:number) {

    if(event.which === 13 && event.code === 'Enter') {

      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }

      this.onDesactivatePrerequisite(index);
      if(index < this.course.prerequisites.length-1) this.onActivatePrerequisite(index+1);
      else this.prerequisiteInput.nativeElement.focus();
    }
  }
}