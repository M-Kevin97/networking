import { EventItem } from '../../search/modules/items/events/shared/event-item';
import { Course } from '../../search/modules/items/courses/shared/course';

export class User {
    public get events(): EventItem[] {
        return this._events;
    }
    public set events(value: EventItem[]) {
        this._events = value;
    }
    public get courses(): Course[] {
        return this._courses;
    }
    public set courses(value: Course[]) {
        this._courses = value;
    }
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get description(): string {
        return this._description;
    }
    public set description(value: string) {
        this._description = value;
    }
    public get job(): string {
        return this._job;
    }
    public set job(value: string) {
        this._job = value;
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
                private _tel?: string, 
                private _job?: string,
                private _description?: string,
                private _courses?: Course[],
                private _events?: EventItem[]) {

    }

    public static fromJson(json: Object): User {
        return new User(null,
                        json['firstname'],
                        json['lastname'],
                        json['mail'],
                        null,
                        json['tel'],
                        json['job'],
                        json['description'],
                        json['courses'],
                        json['events']   
        );
    }
}
