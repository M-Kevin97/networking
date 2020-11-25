import { ImageService } from 'src/app/shared/service/image/image.service';
import { EDIT_PANE } from './edit-item-pane';
import { EventItem } from 'src/app/shared/model/item/event-item';
import { Course } from 'src/app/shared/model/item/course';
import { ItemService } from 'src/app/shared/service/item/item.service';
import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Tag } from 'src/app/shared/model/tag/tag';
import { Module } from 'src/app/shared/model/item/module';
import * as firebase from 'firebase';
import { Database } from 'src/app/core/database/database.enum';

@Component({
  selector: 'app-edit-course',
  templateUrl: './edit-course.component.html',
  styleUrls: ['./edit-course.component.scss']
})
export class EditCourseComponent implements OnInit, OnChanges {

  @Input() item:  Course | EventItem;
  @Input() activePane:  EDIT_PANE = EDIT_PANE.GENERAL;

  newItem: Course | EventItem;
  isSideBarCollapsed:  boolean = false;

  hasBeenUpdated:boolean = false;

  notifGeneral:number = 0;
  notifMedia:boolean = false;

  constructor(private _NgbActiveModal: NgbActiveModal,
              private imageService: ImageService,
              private itemService:  ItemService) { }

  get activeModal() {

    return this._NgbActiveModal;
  }
            
  ngOnInit() { 
  
    this.createItem();
    this.setNewItem();
    this.setNotifGeneral();
    this.setNotifMedia();
  }

  ngOnChanges(changes: SimpleChanges): void {

    this.createItem();
    this.setNewItem();
    this.setNotifGeneral();
    this.setNotifMedia();
  }

  createItem() {
    if(this.item instanceof Course){

      this.newItem = new Course(null,
                                null,
                                null,
                                null,
                                [],
                                null,
                                null,
                                null,
                                [],
                                null,
                                null,
                                [],
                                null,
                                null,
                                null,
                                [],
                                [],
                                null,
                                null,
                                null,
                                null,
                                null,
                                null);
    }
    else if(this.item instanceof EventItem) {

      this.newItem = new EventItem(null,
                                   null,
                                   null,
                                   null,
                                   [],
                                   null,
                                   null,
                                   null,
                                   null,
                                   null,
                                   [],
                                   null,
                                   null,
                                   null,
                                   null,
                                   null,
                                   null,
                                   null);
    }
  }

  setNewItem() {

    this.newItem.id =  this.item.id || null;
    this.newItem.type =  this.item.type || null;
    this.newItem.title =  this.item.title || null;
    this.newItem.tags = this.item.tags || [];
    this.newItem.catchPhrase = this.item.catchPhrase || null;
    this.newItem.description = this.item.description || null;
    this.newItem.price = this.item.price || null;
    this.newItem.iAuthors = this.item.iAuthors || [];
    this.newItem.creationDate = this.item.creationDate || null;
    this.newItem.published = this.item.published;
    this.newItem.searchContent = this.item.searchContent || null;
    this.newItem.data = this.item.data || null;
    this.newItem.consultationLink = this.item.consultationLink || null;
    this.newItem.imageLink = this.item.imageLink || null;
    this.newItem.videoLink = this.item.videoLink || null;
    this.newItem.srcLink = this.item.srcLink || null;

    if(this.item instanceof Course && this.newItem instanceof Course){
    this.newItem.modules = this.item.modules || null;
    this.newItem.skillsToAcquire = this.item.skillsToAcquire || [];
    this.newItem.prerequisites = this.item.prerequisites || [];
    this.newItem.ratings = this.item.ratings || [];
    this.newItem.nbClick = this.item.nbClick || null;
    this.newItem.nbRatings = this.item.nbRatings || null;
    this.newItem.globalNote = this.item.globalNote || null;
    }

    // Event
    if(this.newItem instanceof EventItem && this.item instanceof EventItem){
      this.newItem.location = this.item.location;
      this.newItem.dates = this.item.dates;
    }              
  }

  setItem() {

    this.item.id =  this.newItem.id || null;
    this.item.type =  this.newItem.type || null;
    this.item.title =  this.newItem.title || null;
    this.item.tags = this.newItem.tags || [];
    this.item.catchPhrase = this.newItem.catchPhrase || null;
    this.item.description = this.newItem.description || null;
    this.item.price = this.newItem.price || null;
    this.item.iAuthors = this.newItem.iAuthors || [];
    this.item.creationDate = this.newItem.creationDate || null;
    this.item.published = this.newItem.published;
    this.item.searchContent = this.newItem.searchContent || null;
    this.item.data = this.newItem.data || null;
    this.item.consultationLink = this.newItem.consultationLink || null;
    this.item.imageLink = this.newItem.imageLink || null;
    this.item.videoLink = this.newItem.videoLink || null;
    this.item.srcLink = this.newItem.srcLink || null;

    if(this.item instanceof Course && this.newItem instanceof Course){
    this.item.modules = this.newItem.modules || [];
    this.item.skillsToAcquire = this.newItem.skillsToAcquire || [];
    this.item.prerequisites = this.newItem.prerequisites || [];
    this.item.ratings = this.newItem.ratings || [];
    this.item.nbClick = this.newItem.nbClick || null;
    this.item.nbRatings = this.newItem.nbRatings || null;
    this.item.globalNote = this.newItem.globalNote || null;
    }

    // Event
    if(this.item instanceof EventItem && this.newItem instanceof EventItem){
      this.item.location = this.newItem.location;
      this.item.dates = this.newItem.dates;
    }              
  }

  updateItem(pane:number) {
    switch(pane){

      case EDIT_PANE.GENERAL: {
        this.itemService.updateItemPrimaryInfoInDB(this.newItem, 
          (val) => {
          
            console.error('updateItem', val);
            this.setItem();
            this.displayItemUpdatedAlert();
            this.setNotifGeneral();
          },
          (error) => {
            console.error(error);
          }
        );

        break;
      }
      case EDIT_PANE.MEDIA: {
        this.updateImage().then(
          (url: string)=>{
                
            if(url && url !==''){
  
              this.newItem.imageLink = url;
  
              // À modifier dans le futur, pour l'instant la video == null
              this.newItem.videoLink = null;
            }
        
            this.itemService.updateItemPrimaryInfoInDB(this.newItem, 
              (val) => {
                if(this.item.imageLink !== Database.DEFAULT_IMG_COURSE 
                    && this.item.imageLink !== Database.DEFAULT_IMG_EVENT) {

                  const fileRef = firebase.storage().refFromURL(this.item.imageLink);
                  this.imageService.deleteImageByRef(fileRef,
                    () => {
                      this.setItem();
                      this.displayItemUpdatedAlert();
                      this.setNotifMedia();
                    },
                    (error) => {
                      console.error(error);
                    }
                  );
                } else {
                  this.setItem();
                  this.displayItemUpdatedAlert();
                  this.setNotifMedia();
                }
              },
              (error) => {
                console.error(error);
              }
            );
          }
        );
        break;
      }
      case EDIT_PANE.TAGS: {
        this.itemService.updateTags(this.newItem.tags, this.newItem.id,
          (tags:Tag[]) => {

            this.item.tags = tags;
            this.setNewItem();
            this.displayItemUpdatedAlert();
          },
          (error) => {
            console.error(error);
          });
        break;
      }
      case EDIT_PANE.SKILLS: {

        if(this.newItem instanceof Course && this.item instanceof Course) {

          if(this.newItem.skillsToAcquire && this.newItem.skillsToAcquire.length) 
            this.newItem.skillsToAcquire = this.newItem.skillsToAcquire.reverse();

          if(!this.item.skillsToAcquire) this.item.skillsToAcquire = [];
          if(this.item.skillsToAcquire.length && this.newItem.skillsToAcquire && this.newItem.skillsToAcquire.length) {

            this.itemService.updateSkillsToAcquireInDB(this.newItem.id, this.newItem.skillsToAcquire, 
              () => {

                console.warn('updateSkillsToAcquireInDB', this.newItem);
                this.setItem();
                this.setNewItem();
                this.displayItemUpdatedAlert();
              },
              (error) => {
                console.error(error);
              }
            );
          }
          else if(!this.item.skillsToAcquire.length && this.newItem.skillsToAcquire && this.newItem.skillsToAcquire.length) {

            this.itemService.addSkills(this.newItem.id, this.newItem.skillsToAcquire, 
              () => {

                console.warn('addSkills', this.newItem);
                this.setItem();
                this.setNewItem();
                this.displayItemUpdatedAlert();
              },
              (error) => {
                console.error(error);
              }
            );
          }
        }

        break;
      }
      case EDIT_PANE.PREREQUISITES: {

        if(this.newItem instanceof Course && this.item instanceof Course) {

          if(this.newItem.prerequisites && this.newItem.prerequisites.length) 
            this.newItem.prerequisites = this.newItem.prerequisites.reverse();

          if(!this.item.prerequisites) this.item.prerequisites = [];
          if(this.item.prerequisites.length && this.newItem.prerequisites && this.newItem.prerequisites.length) {

            this.itemService.updatePrerequisitesInDB(this.newItem.id, this.newItem.prerequisites, 
              () => {

                this.setItem();
                this.setNewItem();
                this.displayItemUpdatedAlert();
              },
              (error) => {
                console.error(error);
              }
            );
          }
          else if(!this.item.prerequisites.length && this.newItem.prerequisites && this.newItem.prerequisites.length) {

            this.itemService.addPrerequisites(this.newItem.id, this.newItem.prerequisites, 
              () => {
                
                this.setItem();
                this.setNewItem();
                this.displayItemUpdatedAlert();
              },
              (error) => {
                console.error(error);
              }
            );
          }
        }

        break;
      }
      case EDIT_PANE.MODULES: {

        this.saveCourseContent();
        break;
      }
    }
  }

  saveCourseContent() {
    if(this.newItem instanceof Course && this.item instanceof Course) { 

      console.warn('saveCourseContent', EDIT_PANE.MODULES);
      console.warn('saveCourseContent', this.item.modules, this.newItem.modules);

      if(!this.item.modules) this.item.modules = [];
      if(this.item.modules.length && this.newItem.modules && this.newItem.modules.length) this.updateCourseContent();
      else if(!this.item.modules.length && this.newItem.modules && this.newItem.modules.length) this.createCourseContent();
    }
  }

  private createCourseContent() {
    console.warn('createCourseContent 0');
    if(this.newItem instanceof Course && this.item instanceof Course) { 
      console.warn('createCourseContent 1');
      this.itemService.addCourseContent(this.newItem.modules, this.newItem.id, 
        (val:Module[]) => {
          console.warn('createCourseContent 2', val);
          // clear chapter elements array
          if(this.newItem instanceof Course && this.item instanceof Course){

            console.warn('createCourseContent 3', val);
            this.item.modules.splice(0, this.item.modules.length);
            this.item.modules = val;
            this.setNewItem();
            this.displayItemUpdatedAlert();
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  private updateCourseContent() {
    console.warn('updateCourseContent 0');
    if(this.newItem instanceof Course && this.item instanceof Course) { 
      console.warn('updateCourseContent 1');
      this.itemService.updateCourseContent(this.newItem.modules, this.newItem.id, 
        (val:Module[]) => {
          console.warn('updateCourseContent', val);
          if(this.newItem instanceof Course && this.item instanceof Course){

            console.warn('updateCourseContent', val);
            this.item.modules.splice(0, this.item.modules.length);
            this.item.modules = val;
            this.setNewItem();
            this.displayItemUpdatedAlert();
          }
        },
        (error) => {
          console.error(error);
        }
      );
    }
  }

  updateImage() {

    if(this.imageService.imageToUpload) {

      const fileRef = firebase.storage().ref('images').child('items');

      return this.imageService.uploadFile(this.imageService.imageToUpload, fileRef);
    }      
  }

  displayItemUpdatedAlert() {

    this.hasBeenUpdated = true;
    setTimeout (
      () => {
        this.hasBeenUpdated = false;
      }, 3000
    );
  }

  /**
   * close modal
   * */ 
  private passBack(){

    this.activeModal.close();
  }

  isCourse() {

    return this.newItem.type === 'course';
  }

  getCourse():Course {
  
    if(this.newItem instanceof Course) {
      return this.newItem;
    } else return null;
  }

  getPane(){
    return EDIT_PANE;
  }

  setNotifGeneral() {

    let count:number = 0;

    if(!this.item.title || !this.item.title.length) count++;
    if(!this.item.catchPhrase || !this.item.catchPhrase.length) count++;
    if(!this.item.description || !this.item.description.length) count++;
    if(!this.item.price || this.item.price < 0) count++;
    if(!this.item.consultationLink || !this.item.consultationLink.length) count++;
    
    this.notifGeneral = count;

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

  getNotifPrerequisites(){
    if(this.item instanceof Course) {
      if(this.item.prerequisites && this.item.prerequisites.length) return false;
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
