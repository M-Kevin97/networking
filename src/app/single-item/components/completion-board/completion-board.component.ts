import { ItemService } from 'src/app/shared/service/item/item.service';
import { EventItem } from 'src/app/shared/model/item/event-item';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Course } from 'src/app/shared/model/item/course';
import { Database } from 'src/app/core/database/database.enum';

export enum MISSING_FIELD {
  TITLE = "Sai",
}

@Component({
  selector: 'app-completion-board',
  templateUrl: './completion-board.component.html',
  styleUrls: ['./completion-board.component.css']
})
export class CompletionBoardComponent implements OnInit, OnChanges {

  @Input() item:  Course | EventItem;

  notifGeneral: number = 0;
  notifMedia: boolean = false;

  missingField: string[] = [];

  completionBar:number = 100;

  constructor(private itemService:  ItemService) { }

  ngOnInit() {
    this.missingField.splice(0,  this.missingField.length);
    if(this.item) this.checkCompletion();
  }

  ngOnChanges(changes: SimpleChanges): void {
    
    console.error('ngOnChanges', changes);
    this.missingField.splice(0,  this.missingField.length);
    if(this.item) this.checkCompletion();
  }

  checkCompletion() {

    let count:number = 0;
    let max:number = 0;

    if(!this.item.title || !this.item.title.length) {

      this.missingField.push('Un titre');
      count++;
      max++;
    } else {
      max++;
    }

    if(!this.item.catchPhrase || !this.item.catchPhrase.length) {

      this.missingField.push('Une phrase d\'accroche');
      count++;
      max++;
    } else {
      max++;
    }

    if(!this.item.description || !this.item.description.length) {

      this.missingField.push('Une description');
      count++;
      max++;
    } else {
      max++;
    }
 

    if(this.item.tags && this.item.tags.length) {
     
      max++;
    } else {
      this.missingField.push('Des Tags');
      count++;
      max++;
    }


    if(!this.item.price || this.item.price < 0) {

      this.missingField.push('Un prix');
      count++;
      max++;
    } else {
      max++;
    }


    if(!this.item.consultationLink || !this.item.consultationLink.length) {

      this.missingField.push('Un lien d\'accès');
      count++;
      max++;
    } else {
      max++;
    }


    if(!this.item.imageLink || !this.item.imageLink.length 
      && (this.item.imageLink === Database.DEFAULT_IMG_COURSE
      || this.item.imageLink === Database.DEFAULT_IMG_EVENT)) {

        this.missingField.push('Une image de présentation');
        count++;
        max++;
    } else {
      max++;
    }


    // if(!this.item.videoLink || !this.item.videoLink.length) {
    //     this.missingField.push('Une vidéo de présentation');
    //     count++;
    //     max++;
    //   } else {
    //     max++;
    //   }

    if(this.item instanceof Course) {
      if(this.item.skillsToAcquire && this.item.skillsToAcquire.length) {
       
        max++;
      } else {

        this.missingField.push('Des compétences à acquérir');
        count++;
        max++;
      }

      if(this.item.modules && this.item.modules.length) {
        
        max++;
      } else {

        this.missingField.push('Le contenu de votre formation');
        count++;
        max++;
      }
    }

    if(this.item instanceof EventItem) {

      if(this.item.location){
        max++;
      } else {
        this.missingField.push('Le lieu de votre évènement');
        count++;
        max++;
      }
    }


    if(this.item instanceof EventItem) {

      if(this.item.dates){

        max++;
      } else {

      this.missingField.push('La date de votre évènement');
      count++;
      max++;
      }
    }

    this.completionBar = 100 - Math.round((count/max)*100);
  }

  onPublished() {
    this.itemService.updateIsPublished(this.item.id, true, 
      () => {

      this.item.published = true;
    },
    (error) => {

      console.error(error);
    });
  }

  setNotifMedia() {
    if(!this.item.imageLink || !this.item.imageLink.length 
      && (this.item.imageLink === Database.DEFAULT_IMG_COURSE
      || this.item.imageLink === Database.DEFAULT_IMG_EVENT)) this.notifMedia = true;
  }

  getNotifSkills(){
    if(this.item instanceof Course) {
      if(this.item.skillsToAcquire && this.item.skillsToAcquire.length) return false;
      else return true;
    }
  }

  getNotifModules(){
    if(this.item instanceof Course) {
      if(this.item.modules && this.item.modules.length) return false;
      else return true;
    }
  }

}
