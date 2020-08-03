import { IUser } from './../user/user';
import { Rating } from './rating';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Database } from 'src/app/core/database/database.enum';
import { ICourse } from '../item/course';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  constructor(private datepipe: DatePipe) { }

  // Enregistrer un avis dans la DB 
  saveRating(newRating:Rating, iCourse:ICourse, iUser:IUser){
    if(newRating && iCourse && iUser) {
      return this.saveRatingInCourseDB(newRating, iCourse, iUser).then(
        (val) => {
          console.log('pporzrz____________________',val);
          if(val) {
            console.log('pporzrz____________________',val);
            return this.saveRatingInUserDB(val, iCourse, iUser);
          }
          else return null;
        }
      )
    }
  }

  // Mettre à jour@ un avis dans la DB 
  updateRating(newRating:Rating, iCourse:ICourse, iUser:IUser){
      if(newRating && iCourse && iUser) {

        let updateRating = {


      }
    }
  }

  // Enregistrer un avis avec une référence
  private saveRatingWithReference(ref:firebase.database.Reference, newRating:Rating):Promise<Rating>{

    if(!newRating.id) newRating.id = ref.push().key;

    newRating.publicationDate = this.datepipe.transform(Date.now().toString(), 'dd/MM/yyyy');

    return ref.child(newRating.id).set({
      note: newRating.note,
      comment: newRating.comment,
      publicationDate: newRating.publicationDate,
    }).then(
      ()=>{
        return newRating;
    }).catch(
      (error)=>{
        console.log(error);
        return null;
    });
  }

  // Enregistrer un avis dans la formation, avec l'utilisateur ayant publier l'avis
  private saveRatingInCourseDB(rating:Rating, iCourse:ICourse, iUser:IUser):Promise<Rating>{

    if(rating && iCourse && iUser) {
      var refRatingInCourse = firebase.database().ref(Database.ITEMS)
                                                 .child(iCourse.id)
                                                 .child(Database.RATINGS);

      return this.saveRatingWithReference(refRatingInCourse, rating).then(
        (value) => {

          console.log('saveRatingInCourseDB________',value)

          if(!value) { 
            return null;
          } 

          if(iUser.title===undefined || iUser.title ===null) iUser.title=null;

          return refRatingInCourse.child(value.id).child(Database.AUTHOR).child(iUser.id).set({
            firstname: iUser.firstname,
            lastname: iUser.lastname,
            title: iUser.title,
            ppLink: iUser.ppLink,
          }).then(
            ()=>{
              return value;
          }).catch(
            (error)=>{
              console.log(error);
              return null; 
        });
      }).catch(
        (error) => {
          console.log(error);
        }
      );
    }
    else {
      return null;
    }
  }
  
  // Enregistrer un avis dans l'utilisateur, avec le cours profitant de l'avis
  private saveRatingInUserDB(rating:Rating, iCourse:ICourse, iUser:IUser):Promise<Rating> {

    if(rating && iCourse && iUser) {
      var refRatingInUser = firebase.database().ref(Database.USERS)
                                               .child(iUser.id)
                                               .child(Database.RATINGS);

      return this.saveRatingWithReference(refRatingInUser, rating).then(
        (value) => {
          if(!value) return null;
          
          return refRatingInUser.child(value.id).child(Database.ITEMS).child(iCourse.id).set({
            title: iCourse.title, 
            price: iCourse.price,
            category: iCourse.category,
            imageLink :iCourse.imageLink,
            
          }).then(
            ()=>{
              return value;
          }).catch(
            (error)=>{
              console.log(error);
              return null; 
        });
      });
    } else {
      return null;
    }
  }
 
}