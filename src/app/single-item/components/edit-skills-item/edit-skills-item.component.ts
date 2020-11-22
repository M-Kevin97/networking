import { Course } from 'src/app/shared/model/item/course';
import { Component, OnInit, Input, ViewChild, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-skills-item',
  templateUrl: './edit-skills-item.component.html',
  styleUrls: ['./edit-skills-item.component.css']
})
export class EditSkillsItemComponent implements OnInit {

  @Input() course:  Course;
  skills: string[] = [];
  skillItemForm:  FormGroup;

  @ViewChild('skillInput') skillInput:ElementRef;
  @ViewChildren("skillsInput") skillsInput: QueryList<ElementRef>;

  isSkillInputFocus:boolean = true;
  isSkillSavedFocus:boolean[] = [];

  oldSkill:string = '';

  constructor(private formBuilder:  FormBuilder,
              private _NgbActiveModal:  NgbActiveModal) { }
  
  get activeModal() {
    return this._NgbActiveModal;
  }

  ngOnInit() {

    this.skillItemForm = this.formBuilder.group({
      skillInput: [''],
    });

    // reverse for the ccomponent
    this.skills = Array.from(this.course.skillsToAcquire ? this.course.skillsToAcquire.reverse() : []);
  }

    /**
   * Methode permettant d'ajouter dans la liste des compétences acquises,
   * la compétence saisie dans l'input skill
   * */ 
  onAddSkill() {

    const skill = this.skillItemForm.get('skillInput');

    if(skill.value){

      this.skills.unshift(skill.value);
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

      this.skills.splice(index,1);
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

      if(!skillText.length) this.skills[index] = this.oldSkill;
  
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
      if(index < this.skills.length-1) this.onActivateSkill(index+1);
      else this.skillInput.nativeElement.focus();
    }
  }
}
