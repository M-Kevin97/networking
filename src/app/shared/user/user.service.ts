import { Subject } from 'rxjs/internal/Subject';
import { Injectable } from '@angular/core';
import { User } from './user';
import * as firebase from 'firebase';
import { Course } from 'src/app/search/modules/items/courses/shared/course';
import { EventItem } from 'src/app/search/modules/items/events/shared/event-item';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  user: User;

  users: User[] = [];
  usersSubject = new Subject<User[]>();

  constructor() { }

  emitUsers(){
    this.usersSubject.next(this.users);
  }

  private saveUserToDB(newUser:User){

    var ref = firebase.database().ref('/users');
    ref.child(newUser.id).set({
        firstname: newUser.firstname, 
        lastname: newUser.lastname, 
        mail: newUser.mail, 
        password: newUser.password, 
        tel: newUser.tel, 
        job: newUser.job,
        description: newUser.description,
    }).then(
      () => {
        if(newUser.courses !== null && newUser.courses.length > 0){
          var coursesRef = ref.child(newUser.id).child('courses');
          newUser.courses.forEach(
            (element) => {
               coursesRef.child(element.id).set({
                 title: element.title,
                 rating: element.rating
               }
              );
            }
          );
        }
    }).then(
      () => {
        if(newUser.events !== null && newUser.events.length > 0){
        var eventsRef = ref.child(newUser.id).child('events');
        newUser.events.forEach(
          (element) => {
             eventsRef.child(element.id).set({
               title: element.title
             });
            }
          );
        }
      }
    );
  }

  createNewUser(newUser:User){
    this.saveUserToDB(newUser);
  }

  getUsersFromDB(){
    firebase.database().ref('/users').on('value', 
      (data) => {
        this.users = data.val() ? data.val() : [];
        this.emitUsers();
        console.log(data.val());
      }
    );
  }

  getSingleUserFromDBWithMail(email:string){
    return new Promise(
      (resolve, reject) => {
        firebase.database().ref('/users/'+email).once('value').then(
          (user) => {

              resolve(user.val());
              console.log(user.val());
          }, (error) => {

            reject(error);
          }
        );
      }
    );
  }

  getSingleUserFromDBWithId(id:string){ 

    console.log('user id :', id);

    return firebase.database().ref('/users/'+id).once('value').then(
      function(user) {
        console.log(user.val());
        return user.val();
      }
    );
  }

  addCourseToUserInDB(uid:string, course:Course){

    var ref = firebase.database().ref('/users').child(uid).child('courses');

    ref.child(course.id).set({
        title: course.title, 
        rating: course.rating,
    });
  }

  addEventToUserInDB(uid:string, event:EventItem){

    var ref = firebase.database().ref('/users').child(uid).child('events');

    const eventId = ref.push().key;

    ref.child(eventId).set({
        title: event.title, 
    });

  }
}
