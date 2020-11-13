import { IItem } from 'src/app/shared/model/item/item';
import { UserLevel } from './../UserLevel.enum';

export interface IUser {
    id:string;
    firstname:string;
    lastname:string;
    title:string;
    ppLink:string;
    bio:string;
    data:boolean;
    iCourses:IItem[];
    iEvents:IItem[];
    itemId?:string[];
}

export class User {
    public get itemsId(): string[] {
        return this._itemsId;
    }
    public set itemsId(value: string[]) {
        this._itemsId = value;
    }
    public get role(): string {
        return this._role;
    }
    public set role(value: string) {
        this._role = value;
    }
    public get data(): boolean {
        return this._data;
    }
    public set data(value: boolean) {
        this._data = value;
    }
    public get accessLevel(): UserLevel {
        return this._accessLevel;
    }
    public set accessLevel(value: UserLevel) {
        this._accessLevel = value;
    }
    public get ppLink(): string {
        return this._ppLink;
    }
    public set ppLink(value: string) {
        this._ppLink = value;
    }
    
    public get events(): IItem[] {
        return this._events;
    }
    public set events(value: IItem[]) {
        this._events = value;
    }
    public get courses(): IItem[] {
        return this._courses;
    }
    public set courses(value: IItem[]) {
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

    constructor(private _id:            string,
                private _firstname:     string, 
                private _lastname:      string, 
                private _mail:          string, 
                private _password:      string,
                private _ppLink:        string,
                private _tel:           string, 
                private _title:         string,
                private _bio:           string,
                private _role:          string,
                private _accessLevel:   UserLevel,
                private _data:          boolean,
                private _courses:       IItem[],
                private _events:        IItem[],
                private _itemsId?:       string[]) {

    }

    getIUser(){
        const iUser:IUser = {
            id:         this.id || null,
            firstname:  this.firstname || null,
            lastname:   this.lastname || null,
            title:      this.title || null,
            ppLink:     this.ppLink || null,
            bio:        this.bio || null,
            data:       this.data || null,
            iCourses:   this.courses || null,
            iEvents:    this.events || null,
            itemId:    this.itemsId || null,
        }

        return iUser;
    }

    getName() {
        return this.firstname+' '+this.lastname;
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

    public static userFromJson(json: Object): User {

        if(!json) return null;

        const jsonItems = json['items'];
        let crs = null, evts = null;

        console.warn('userFromJson', jsonItems);

        if(jsonItems)  {
            //crs = Course.getICoursesItemFromJson(jsonItems);
            //evts = EventItem.getIEventsItemFromJson(jsonItems);
        }     

        return new User(null,
                        json['firstname'] || null,
                        json['lastname'] || null,
                        json['mail'] || null,
                        json['password'] || null,
                        json['ppLink'] || null,
                        json['tel'] || null,
                        json['title'] || null,
                        json['bio'] || null,
                        json['role'] || null,
                        json['accessLevel'] || null,
                        json['data'] || null,
                        crs || null,
                        evts || null,
                        json['items'] ? Array.from(Object.keys(json['items'])) : null);
    }

    public static iUserFromJson(json: Object): IUser {

        if(!json) return null;  

        let iUser:IUser;

        iUser = { 
            id:         json[0] || null,
            firstname:  json['firstname'] || null,
            lastname:   json['lastname'] || null,
            title:      json['title'] || null,
            ppLink:     json['ppLink'] || null,
            bio:        json['bio'] || null,
            data:       json['data'] || null,
            iCourses:   json['courses'] || null,
            iEvents:    json['events'] || null,
            itemId:     Array.from(Object.keys(json['items'])) || null,
        };

        return iUser;
    }
}