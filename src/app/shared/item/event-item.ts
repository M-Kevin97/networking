import { Item, IItem } from 'src/app/shared/item/item';
import { Category } from 'src/app/shared/item/category/category';
import { IUser, User } from '../user/user';

export interface ILocationEvent {
    location: string;
    address: string;
    zip: number;
    city: string;
    country: string;
}

export interface IDatesEvent {
    startDate: string;
    endDate: string;
  }

export interface IEvent extends IItem {
    location:ILocationEvent;
    dates:IDatesEvent;
}   

export class EventItem extends Item {

    public get dates(): IDatesEvent {
        return this._dates;
    }
    public set dates(value: IDatesEvent) {
        this._dates = value;
    }

    public get location(): ILocationEvent {
        return this._location;
    }
    public set location(value: ILocationEvent) {
        this._location = value;
    }

    constructor(id: string, 
                title: string, 
                category:Category,
                catchPrase:string,
                description: string,
                price: number,
                private _location: ILocationEvent,
                private _dates: IDatesEvent,
                authors:IUser[],
                creationDate: string, 
                published:boolean, 
                imageLink?: string,
                videoLink?: string){

        super(id, 
                title,
                category,
                catchPrase,
                description, 
                price, 
                authors,
                creationDate,  
                published,
                imageLink,
                videoLink);
    }

    public static getIEventsItemFromJson(json: Object): IEvent[] {

        if(json === null || json === undefined) return null;
        console.log(json);

        var events = Object.keys(json).map(
            function(eventsIdIndex){
            let eventJson = json[eventsIdIndex];

            var event:IEvent = {
                id: eventsIdIndex,
                title: eventJson['title'],
                category: Category.categoryFromJson(eventJson['categories']),
                price: eventJson['price'],
                imageLink: eventJson['imageLink'],
                authors:this.getIAuthorsItemFromJson(eventJson['authors']),
                published: eventJson['published'],
                location:this.getILocationFromJson(eventJson['location']),
                dates:this.getILocationFromJson(eventJson['dates'])
            };
            return event;
        });

        return events;
    }

    public static getILocationFromJson(json: Object): ILocationEvent {

        if(json === null && json === undefined) return null;

        console.log(json);

        const location:ILocationEvent = {

            location: json['location'],
            address: json['address'],
            zip: json['zip'],
            city: json['city'],
            country: json['country']
          }

        return location;
    }


    public static getIDatesFromJson(json: Object): IDatesEvent {

        if(json === null && json === undefined) return null;

        console.log(json);

        const dates:IDatesEvent = {
            startDate: json['startDate'],
            endDate: json['endDate']
          }

        return dates;
    }


    public static eventFromJson(json: Object): EventItem {
        return new EventItem(
            json['id'],
            json['title'],
            Category.categoryFromJson(json['categories']),
            json['catchPhrase'],
            json['description'],
            json['price'],
            this.getILocationFromJson(json['location']),
            this.getIDatesFromJson(json['dates']),
            this.getIAuthorsItemFromJson(json['authors']),
            json['creationDate'],
            json['published'],
            json['imageLink'],
            json['videoLink']
        );
    }

    public static eventsFromJson(json: Object): EventItem[] {

        var events = Object.keys(json).map(
            function(eventsIdIndex){
            let eventJson = json[eventsIdIndex];

            var course = EventItem.eventFromJson(eventJson)
            course.id = eventsIdIndex;

            return course;
        });

        return events;
    }
}
