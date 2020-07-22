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
                type:'IEvent',
                id: eventsIdIndex,
                title: eventJson['title'],
                category: Category.categoryFromJson(eventJson['category']),
                price: eventJson['price'],
                imageLink: eventJson['imageLink'],
                authors:Item.getIAuthorsItemFromJson(eventJson['authors']),
                published: eventJson['published'],
                location:Item.getILocationFromJson(eventJson['location']),
                dates:Item.getIDatesFromJson(eventJson['dates'])
            };
            return event;
        });

        return events;
    }

    public static eventFromJson(json: Object): EventItem {
        if(json === null || json === undefined) return null;
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

        if(json === null || json === undefined) return [];

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
