import { Category } from '../category/category';
import { IUser, User } from '../user/user';
import { IItem, Item } from './item';

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
                type:string,
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
                searchContent:string,
                data:boolean,
                imageLink?: string,
                videoLink?: string){

        super(id, 
                type,
                title,
                category,
                catchPrase,
                description, 
                price, 
                authors,
                creationDate,  
                published,
                searchContent,
                data,
                imageLink,
                videoLink);
    }

    public static getIEventsItemFromJson(json: Object): IEvent[] {

        if(json === null || json === undefined) return null;
        console.log(json);

        var evts:IEvent[] = [];
        var events = Object.keys(json).map(
            function(eventsIdIndex){
            let eventJson = json[eventsIdIndex];

            if(eventJson['type']==='event') {

                var event:IEvent = {
                    data:eventJson['data'],
                    type:eventJson['type'],
                    id: eventsIdIndex,
                    title: eventJson['title'],
                    category: Category.categoryFromJson(eventJson['category']),
                    catchPhrase: eventJson['catchPhrase'],
                    price: eventJson['price'],
                    imageLink: eventJson['imageLink'],
                    iAuthors:null,
                    published: eventJson['published'],
                    location:Item.getILocationFromJson(eventJson['location']),
                    dates:Item.getIDatesFromJson(eventJson['dates']),
                };
                evts.push(event);
                console.log('kjzvemzie',evts.length);
                return event;
            }
        });
        if(evts.length<=0) return null;
        else return evts;
    }

    public static eventFromJson(json: Object): EventItem {
        if(json === null || json === undefined) return null;
        console.log(json);

        return new EventItem(
            json['id'],
            json['type'],
            json['title'],
            Category.categoryFromJson(json['category']),
            json['catchPhrase'],
            json['description'],
            json['price'],
            this.getILocationFromJson(json['location']),
            this.getIDatesFromJson(json['dates']),
            null,
            json['creationDate'],
            json['published'],
            json['searchContent'],
            json['imageLink'],
            json['videoLink'],
        );
    }

    public static eventsFromJson(json: Object): EventItem[] {

        if(json === null || json === undefined) return [];

        var events = Object.keys(json).map(
            function(eventsIdIndex){
            let eventJson = json[eventsIdIndex];

            var event = EventItem.eventFromJson(eventJson)
            event.id = eventsIdIndex;

            return event;
        });

        return events;
    }

    public static iEventFromJson(json: Object): IEvent {
        if(json === null || json === undefined) return null;
        console.log(json);

        var iEvent:IEvent = {
            data:json['data'],
            type:json['type'],
            id: json[0],
            title: json['title'],
            category:null,
            price: json['price'],
            imageLink:json['imageLink'],
            catchPhrase:json['catchPhrase'],
            iAuthors:[],
            published:json['published'],
            location: this.getILocationFromJson(json['location']),
            dates: this.getIDatesFromJson(json['dates'])
        };

        return iEvent;
    }
}
