import { ICourse } from './../item/course';
import { Course } from 'src/app/shared/item/course';
import { EventItem, IEvent } from '../item/event-item';

export interface IUser {
    id:string;
    firstname:string;
    lastname:string;
    title:string;
    ppLink:string;
}

export class User {
    public get ppLink(): string {
        return this._ppLink;
    }
    public set ppLink(value: string) {
        this._ppLink = value;
    }
    
    public get events(): IEvent[] {
        return this._events;
    }
    public set events(value: IEvent[]) {
        this._events = value;
    }
    public get courses(): ICourse[] {
        return this._courses;
    }
    public set courses(value: ICourse[]) {
        this._courses = value;
    }
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get bio(): string {
        return this._bio;
    }
    public set bio(value: string) {
        this._bio = value;
    }
    public get title(): string {
        return this._title;
    }
    public set title(value: string) {
        this._title = value;
    }
    public get tel(): string {
        return this._tel;
    }
    public set tel(value: string) {
        this._tel = value;
    }
    public get password(): string {
        return this._password;
    }
    public set password(value: string) {
        this._password = value;
    }
    public get mail(): string {
        return this._mail;
    }
    public set mail(value: string) {
        this._mail = value;
    }
    public get lastname(): string {
        return this._lastname;
    }
    public set lastname(value: string) {
        this._lastname = value;
    }
    public get firstname(): string {
        return this._firstname;
    }
    public set firstname(value: string) {
        this._firstname = value;
    }

    constructor(private _id: string,
                private _firstname: string, 
                private _lastname: string, 
                private _mail: string, 
                private _password: string,
                private _ppLink: string,
                private _tel: string, 
                private _title: string,
                private _bio: string,
                private _courses: ICourse[],
                private _events: IEvent[]) {

    }

    getIUser(){
        const iUser:IUser = {
            id: this.id,
            firstname: this.firstname,
            lastname: this.lastname,
            title: this.title,
            ppLink: this.ppLink,
        }

        return iUser;
    }

    public static userFromJson(json: Object): User {

        if(json === null || json === undefined) return null;

        const jsonItems = json['items'];
        let crs, evts;

        if(jsonItems === null || jsonItems === undefined) { 
            crs=null;
            evts=null;

        } else {
            crs = Course.getICoursesItemFromJson(jsonItems['courses']);
            evts = EventItem.getIEventsItemFromJson(jsonItems['events']);
        }

        return new User(null,
                        json['firstname'],
                        json['lastname'],
                        json['mail'],
                        json['password'],
                        json['ppLink'],
                        json['tel'],
                        json['title'],
                        json['bio'],
                        crs,
                        evts);
    }

    public static usersFromJson(json: Object): User[] {

        if(json === null || json === undefined) return null;

        var users = Object.keys(json).map(
            function(usersIdIndex){
            let userJson = json[usersIdIndex];

            var user = User.userFromJson(userJson)
            user.id = usersIdIndex;

            return user;
        });

        return users;
    }
}