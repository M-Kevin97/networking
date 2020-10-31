import { IUser } from './../../model/user/user';
import { ICourse } from 'src/app/shared/model/item/course';
import { ItemService } from 'src/app/shared/service/item/item.service';
import { UserService } from 'src/app/shared/service/user/user.service';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Database } from 'src/app/core/database/database.enum';
import { Rating } from '../../model/rating/rating';
import { rejects } from 'assert';
import { resetFakeAsyncZone } from '@angular/core/testing';

@Injectable({
  providedIn: 'root'
})
export class RatingService {

  ratingsDB = firebase.database().ref(Database.RATINGS);
  userRatingsDB = firebase.database().ref(Database.USERS);
  courseRatingsDB = firebase.database().ref(Database.ITEMS);

  constructor(private datepipe: DatePipe) { }

  /**
   *  -------------------- ADD
   */

  // Enregistrer un avis dans la DB 
  addRatingInDB(newRating:Rating, cb){

    if(newRating) {

      newRating.publicationDate = this.datepipe.transform(Date.now().toString(), 'dd/MM/yyyy');

      // adding rating in RatingsDB
      return this.addRatingWithReference(this.ratingsDB, newRating).then(
        (rating:Rating) => {

          // adding rating ID in CourseRatingsDB
          return this.addRatingInCourseDB(rating,
            (ratingInCourse:Rating) => {
              console.log('pporzrz____________________',ratingInCourse);

              if(ratingInCourse) {
                console.log('pporzrz____________________',ratingInCourse);

                 // adding rating ID in UserRatingsDB
                return this.addRatingInUserDB(ratingInCourse, cb);
              }
              else return null;
            }
          );

        }
      );
    }
  }

  // Add the rating id into the course DB
  private addRatingInCourseDB(newRating:Rating, cb) {

    if(newRating) {
      var refRatingInCourse = this.courseRatingsDB.child(newRating.course.id)
                                                  .child(Database.RATINGS);

      this.addRatingWithReference(refRatingInCourse, newRating).then(cb);
    } else return null;
  }

  // Add the rating id into the user DB
  private addRatingInUserDB(rating:Rating, cb) {

    console.warn('addRatingInUserDB', rating);

    if(rating) {
      var refRatingInUser = this.userRatingsDB.child(rating.user.id)
                                              .child(Database.RATINGS);

      return this.addRatingWithReference(refRatingInUser, rating).then(cb);
  
    } else return null;
  }
  
  // add rating id into the DB with a reference
  private addRatingWithReference(ref:firebase.database.Reference, newRating:Rating):Promise<Rating>{

    if(!newRating.id) {

      newRating.id = ref.push().key;

      return ref.child(newRating.id).set({
        title: newRating.title,
        note: newRating.note,
        comment: newRating.comment,
        publicationDate: newRating.publicationDate,
        user: newRating.user.id,
        course: newRating.course.id
      }).then(
        ()=>{
          return newRating;
      }).catch(
        (error)=>{
          console.log(error);
          return null;
      });

    } else {

      return ref.update({
        [newRating.id] : '0'
      }).then(
        ()=>{
          return newRating;
      }).catch(
        (error)=>{
          console.log(error);
          return null;
      });
    }
  }

  /**
   *  -------------------- UPDATE
   */

  // Mettre à jour@ un avis dans la DB 
  updateRating(rating:Rating){
      if(rating) {

        rating.publicationDate = this.datepipe.transform(Date.now().toString(), 'dd/MM/yyyy');

        this.ratingsDB.child(rating.id)
                      .update({

          title: rating.title,
          note: rating.note,
          comment: rating.comment,
          publicationDate: rating.publicationDate,
        }
      );       
    }
  } 

  /**
   *  -------------------- GET
   */

  // Get the ratings 
  public static async getRatingsFromJSON(ratingsJson:any, iCourse:ICourse, iUser:IUser) {

    console.warn('getRatingsFromJSON', ratingsJson);

    let requestRatings = Object.keys(ratingsJson).map((key) => {

      return new Promise((resolve) => {
        
        // rating variable for each rating
        let singleRating:Rating;

        console.warn('getRatingsFromJSON', key);

        // get the single rating content by ID
        firebase.database().ref(Database.RATINGS).child(key).once('value').then(
          (rating) => {
            console.log('has rating', rating.val());

            if(rating.val()) {

              console.log(rating.val());

              singleRating = Rating.ratingFromJson(rating.val());
              singleRating.id = key;

              const ratingUserId = rating.val()['user'];
              const ratingCourseId = rating.val()['course'];

              console.log('ratingUserId', ratingUserId);

              console.log('ratingCourseId', ratingCourseId);
  
              // if on single course page
              if(!iUser && ratingUserId) {
                // getting the single IUser of a single rating 
                UserService.getSingleiUserFromDBWithId(ratingUserId).then(
                  (val:IUser)=> {
                    if(val) {
  
                      val.id = ratingUserId;
                      singleRating.user = val;

                      console.log('getSingleiUserFromDBWithId', singleRating.user);

                      resolve(singleRating);
                    }
                  }
                );
              } else singleRating.user = iUser;
  
              // // if on single user page
              // if(!iCourse && ratingCourseId) {
              //   // getting the single ICourse of a single rating
              //   ItemService.getSingleiItemFromDBById(ratingCourseId).then(
              //     (val:ICourse) => {
              //       if(val) {
  
              //         val.id = ratingUserId;
              //         singleRating.course = val;
              //       }
              //     }
              //   );
              // } else singleRating.course = iCourse;
  
              resolve(singleRating);
            }
            //else reject()
          }
        );

      });
    });

    // get ratings
    return await Promise.all(requestRatings);
  }
  
  
  // 1 - Get the ratings ID of the single course

  // 2 - For each rating ID, get the single rating by his Id

  





  /**
   *  -------------------- REMOVE
   */

}