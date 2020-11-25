import { IItem } from 'src/app/shared/model/item/item';
import { IUser } from './../../model/user/user';
import { Course } from 'src/app/shared/model/item/course';
import { UserService } from 'src/app/shared/service/user/user.service';
import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Database } from 'src/app/core/database/database.enum';
import { Rating } from '../../model/rating/rating';

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

              if(ratingInCourse) {
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
          console.error(error);
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
          console.error(error);
          return null;
      });
    }
  }

  /**
   *  -------------------- UPDATE
   */

  // Mettre à jour@ un avis dans la DB 
  updateRating(rating:Rating, cb){
      if(rating) {

        rating.publicationDate = this.datepipe.transform(Date.now().toString(), 'dd/MM/yyyy');

        this.ratingsDB.child(rating.id)
                      .update({
          title: rating.title,
          note: rating.note,
          comment: rating.comment,
          publicationDate: rating.publicationDate,
        }
      ).then(
        () => {
          return rating;
        }
      )
      .then(cb);       
    }
    else return null;
  } 

  /**
   *  -------------------- GET
   */

  // Get the ratings 
    
  // 1 - Get the ratings ID of the single course

  // 2 - For each rating ID, get the single rating by his Id

  public static async getRatingsFromJSON(ratingsJson:any, iCourse:IItem, iUser:IUser) {

    let requestRatings = Object.keys(ratingsJson).map((key) => {

      return new Promise((resolve) => {
        
        // rating variable for each rating
        let singleRating:Rating;

        // get the single rating content by ID
        firebase.database().ref(Database.RATINGS).child(key).once('value').then(
          (rating) => {
            if(rating.val()) {

              //console.log(rating.val());

              singleRating = Rating.ratingFromJson(rating.val());
              singleRating.id = key;

              const ratingUserId = rating.val()['user'];
              const ratingCourseId = rating.val()['course'];
  
              // if on single course page
              if(!iUser && ratingUserId) {
                // getting the single IUser of a single rating 
                UserService.getiUserFromDBWithId(ratingUserId).then(
                  (val:IUser)=> {
                    if(val) {
  
                      val.id = ratingUserId;
                      singleRating.user = val;

                      resolve(singleRating);
                    }
                  }
                );
              } else singleRating.user = iUser;
  
              // if on single user page
              if(!iCourse && ratingCourseId) {
                // getting the single ICourse of a single rating
                firebase.database().ref(Database.ITEMS).child(ratingCourseId).once('value').then(
                  (itemJson) => {
                    //console.log(itemJson.val());
            
                    let iCourse:IItem;
                    iCourse = Course.iCourseFromJson(itemJson.val());
                    iCourse.id = ratingCourseId;
                    singleRating.course = iCourse;
            
                    return iCourse;
                  }
                );
              } else singleRating.course = iCourse;
  
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

  /**
   *  -------------------- REMOVE
   */
  removeRating(rating:Rating, cb) {

    this.courseRatingsDB.child(rating.course.id)
                        .child(Database.RATINGS)
                        .child(rating.id)
                        .remove()
                        .then(
                          ()=> {
                            this.userRatingsDB.child(rating.user.id)
                            .child(Database.RATINGS)
                            .child(rating.id)
                            .remove().then(
                              () => {
                                this.ratingsDB.child(rating.id)
                                .remove()
                                .then(cb)
                              }
                            );
                          }
                        );
  }

}