import { View } from './../../model/item/view';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Database } from 'src/app/core/database/database.enum';
import { Tag } from '../../model/tag/tag';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  tagDB = firebase.database().ref(Database.TAGS);

  // Tags Array
  tags:Tag[] = [];

  tagsSubject = new Subject<Tag[]>();

  constructor(private datepipe: DatePipe) { }

  /**
  *  -------------------- EMIT
  */

  emitTags() {
    this.tagsSubject.next(this.tags);
  }

  /**
  *  -------------------- ADD
  */
  // Enregistrer un tag dans la DB TAGS
  addTagInDB(newTag:Tag, cb){

    if(newTag) {
      //newTag = this.datepipe.transform(Date.now().toString(), 'dd/MM/yyyy');
      const regex = /[ \-)+]/
      let str = newTag.name.toLowerCase();

      let words:string[] = str.split(regex);
      words.forEach((word, i) => {
        words[i] = word.charAt(0).toUpperCase() + word.slice(1);
      });

      // String Array to string
      let tag = words.join(' ');

      // put the old special characters back

      for(let i=0; i<=str.length; i++) {

        if(regex.test(str.charAt(i))) {
          if(i <= str.length-1)  tag = tag.substring(0,i) + str.charAt(i) + tag.substring(i+1);
        } 
      }

      newTag.name = tag;

      return TagService.addTagWithReference(this.tagDB, newTag).then(cb);
    }
  }

  // save tags in db pass in parametres
  public static addTagsWithReference(ref:firebase.database.Reference, newTags:Tag[]):Promise<Tag[]> {

    if(newTags && newTags.length) {

      var promises = [];
      newTags.forEach((tag)=>{

        promises.push(
          new Promise((resolve) => {

            TagService.addTagWithReference(ref.child(Database.TAGS), tag).then(
              ()=>{
                resolve(tag);
            });
          })
        );
      });

      return Promise.all(promises)
                    .catch(
                      (error) => {
                          console.error(error);
                          return null;
                        }
                      );
    }
  }

  public static addTagWithReference(ref:firebase.database.Reference, newTag:Tag):Promise<Tag> {

    // create id if the tag don't have an id
    if(!newTag.id) newTag.id = ref.push().key;

    return ref.child(newTag.id).set({
      name: newTag.name,
    }).then(
      ()=>{
        return newTag;
    }).catch(
      (error)=>{
        console.log(error);
        return null;
    });
  }

  addTagViewInDB(tag:Tag, view:View) {

  }


  /**
  *  -------------------- GET
  */
  // get all the tags
  getAllTagsFromDB(cb) {
    
    this.tagDB.once('value').then(
      (tagsJson) => {

        // variable
        var tags:Tag[] = []; 

        tags = Tag.tagsFromJson(tagsJson.val());

        // clear tags array
        this.tags.splice(0, this.tags.length);

        this.tags = Array.from(tags);

        return tags;
      }
    ).then(cb);
  }

  getItemTags(itemId:string, cb) {

    if(itemId) {
      let ref = firebase.database().ref(Database.ITEMS).child(itemId)
                                                       .child(Database.TAGS);

      this.getTagsFromDBByRef(ref, cb);
    }
  }

  private getTagsFromDBByRef(ref:firebase.database.Reference, cb) {
    
    ref.once('value').then(
      (tagsJson) => {
        return Tag.tagsFromJson(tagsJson);
      }
    ).then(cb);
  }

  getSingleTagByName(tagName:string) {

    if(tagName) {

    }
  }

  /**
  *  -------------------- UPDATE
  */

  



  /**
  *  -------------------- REMOVE
  */
  removeTag(tag:Tag, cb) {

    this.tagDB.child(tag.id).remove().then(cb);
  }

  public static removeTagsWithReference(ref:firebase.database.Reference, cb) {

    ref.child(Database.TAGS).remove().then(cb);
  }
}
