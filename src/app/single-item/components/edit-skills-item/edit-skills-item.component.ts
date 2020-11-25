import { Course } from 'src/app/shared/model/item/course';
import { Component, OnInit, Input, ViewChild, ElementRef, QueryList, ViewChildren, ChangeDetectorRef, OnChanges, AfterViewChecked, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-edit-skills-item',
  templateUrl: './edit-skills-item.component.html',
  styleUrls: ['./edit-skills-item.component.css']
})
export class EditSkillsItemComponent implements OnInit, OnChanges, AfterViewChecked {

  @Input() course:  Course;
  skillItemForm:  FormGroup;

  @ViewChild('skillInput') skillInput:ElementRef;
  @ViewChildren("skillsInput") skillsInput: QueryList<ElementRef>;

  isSkillInputFocus:boolean = true;
  isSkillSavedFocus:boolean[] = [];

  oldSkill:string = '';

  constructor(private formBuilder:  FormBuilder,
              private cdRef:  ChangeDetectorRef) { }

  ngOnInit() {

    this.skillItemForm = this.formBuilder.group({
      skillInput: [''],
    });

    if(!this.course.skillsToAcquire) this.course.skillsToAcquire = [];
    else if(this.course.skillsToAcquire && this.course.skillsToAcquire.length) 
    this.course.skillsToAcquire = this.course.skillsToAcquire.reverse();
  }

  ngOnChanges(changes: SimpleChanges): void {


    if(!this.course.skillsToAcquire) this.course.skillsToAcquire = [];
    else if(this.course.skillsToAcquire && this.course.skillsToAcquire.length) 
    this.course.skillsToAcquire = this.course.skillsToAcquire.reverse();
  }

  ngAfterViewChecked() {

    this.cdRef.detectChanges();
  }

    /**
   * Methode permettant d'ajouter dans la liste des compétences acquises,
   * la compétence saisie dans l'input skill
   * */ 
  onAddSkill() {

    const skill = this.skillItemForm.get('skillInput');

    if(skill.value){

      this.course.skillsToAcquire.unshift(skill.value);
      this.isSkillSavedFocus.unshift(false);
      skill.reset();
    }
  }

  /**
   * Methode permettant d'ajouter dans la liste des compétences acquises,
   * la compétence saisie dans l'input skill
   * */ 
  onRemoveSkill(index:number) {
 
    if (index > -1) {

      this.course.skillsToAcquire.splice(index,1);
      this.isSkillSavedFocus.splice(index,1);
    } 
  }

  /**
   * Skill Input
   */

  onDetectAddSkillKeyDown(event) {

    if(event.which === 13) {

      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }

      this.onAddSkill();
    }
  }

  /**
   *  SkillsCourse
   */


  onActivateSkill(index:number){

    if(index > -1) {

      this.isSkillSavedFocus[index] = true;
      this.oldSkill = this.skillsInput.toArray()[index].nativeElement.textContent;

      this.skillsInput.toArray()[index].nativeElement.focus();
    }
  }

  onDesactivateSkill(index:number){

    if(index > -1) {

      let skillText = this.skillsInput.toArray()[index].nativeElement.textContent;

      if(!skillText.length) this.course.skillsToAcquire[index] = this.oldSkill;
  
      this.isSkillSavedFocus[index] = false;
    }
  }

  onDetectSetskillSavedKeyDown(event, index:number) {

    if(event.which === 13 && event.code === 'Enter') {

      if (event.preventDefault) {
        event.preventDefault();
      } else {
        event.returnValue = false;
      }

      this.onDesactivateSkill(index);
      if(index < this.course.skillsToAcquire.length-1) this.onActivateSkill(index+1);
      else this.skillInput.nativeElement.focus();
    }
  }
}
