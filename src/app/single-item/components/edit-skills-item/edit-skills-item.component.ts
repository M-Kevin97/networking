import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-skills-item',
  templateUrl: './edit-skills-item.component.html',
  styleUrls: ['./edit-skills-item.component.css']
})
export class EditSkillsItemComponent implements OnInit {

  @Input() skills:string[];
  oldSkills: string[] = [];
  skillItemForm: FormGroup;

  constructor(private formBuilder:FormBuilder,
              private _NgbActiveModal: NgbActiveModal) { }
  
  get activeModal() {
    return this._NgbActiveModal;
  }

  ngOnInit() {

    this.skillItemForm = this.formBuilder.group({
      skill: ['',[Validators.required]],
    });

    if(!this.skills){
      this.skills = [];
    }
    this.oldSkills = Array.from(this.skills);
  }

  /**
   * Methode permettant d'ajouter dans la liste des compétences acquises,
   * la compétence saisie dans l'input skill
   * */ 
  AddSkill() {
    const skill = this.skillItemForm.get('skill').value;
    if(skill && skill!==''){
      this.skills.push(skill);
      this.skillItemForm.get('skill').patchValue('');
    }
  }

  /**
   * Methode permettant d'ajouter dans la liste des compétences acquises,
   * la compétence saisie dans l'input skill
   * */ 
  deleteSkill(index:number) {
 
    if (index !== -1) {
      this.skills.splice(index,1);
    } 
  }
  
    /**
   * Methode permettant d'envoyer à au component ayant appeler EDITSKILL,
   * de récuper les valeurs saisies
   * */ 
  passBack(){

    this.activeModal.close(this.skills);
  }

}
