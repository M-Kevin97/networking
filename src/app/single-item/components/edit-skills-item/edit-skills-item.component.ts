import { ItemService } from 'src/app/shared/service/item/item.service';
import { Course } from 'src/app/shared/model/item/course';
import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Item } from 'src/app/shared/model/item/item';

@Component({
  selector: 'app-edit-skills-item',
  templateUrl: './edit-skills-item.component.html',
  styleUrls: ['./edit-skills-item.component.css']
})
export class EditSkillsItemComponent implements OnInit {

  @Input() course:  Course;
  skills: string[] = [];
  skillItemForm:  FormGroup;

  constructor(private formBuilder:  FormBuilder,
              private itemService:  ItemService,
              private _NgbActiveModal:  NgbActiveModal) { }
  
  get activeModal() {
    return this._NgbActiveModal;
  }

  ngOnInit() {

    this.skillItemForm = this.formBuilder.group({
      skill: [''],
    });

    this.skills = Array.from(this.course.skillsToAcquire || []);
  }

  /**
   * Methode permettant d'ajouter dans la liste des compétences acquises,
   * la compétence saisie dans l'input skill
   * */ 
  onAddSkill() {
    const skill:string = this.skillItemForm.get('skill').value;

    if(skill && skill.length){

      this.skills.push(skill);
      this.skillItemForm.reset();
    }
  }

  /**
   * Methode permettant d'ajouter dans la liste des compétences acquises,
   * la compétence saisie dans l'input skill
   * */ 
  onDeleteSkill(skill:string) {
 
    if (skill && skill.length) {

      this.skills.splice(this.skills.findIndex((val) => {skill === val}),1);
    } 
  }
  
    /**
   * Methode permettant d'envoyer à au component ayant appeler EDITSKILL,
   * de récuper les valeurs saisies
   * */ 
  passBack(){

    if(this.skills && this.skills.length) {

      this.itemService.updateSkillsToAcquireInDB(this.course.id, this.skills,
        () => {
          this.activeModal.close(this.skills);
        },
        (error) => {

        }
      );

    }
  }

}
