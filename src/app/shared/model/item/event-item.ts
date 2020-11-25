import { Category } from '../category/category';
import { Tag } from '../tag/tag';
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
                tags:Tag[],
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
                consultationLink:string,
                imageLink?: string,
                videoLink?: string){

        super(id, 
                type,
                title,
                category,
                tags,
                catchPrase,
                description, 
                price, 
                authors,
                creationDate,  
                published,
                searchContent,
                data,
                consultationLink,
                imageLink,
                videoLink);
    }

    public static getIEventsItemFromJson(json: Object): IEvent[] {

        if(json === null || json === undefined) return null;

        var evts:IEvent[] = [];
        var events = Object.keys(json).map(
            function(eventsIdIndex){
            let eventJson = json[eventsIdIndex];

            if(eventJson['type']==='event') {

                var event:IEvent = {
                    consultationLink:eventJson['consultationLink'] || null,
                    data:   eventJson['data'] || null,
                    type:   eventJson['type'] || null,
                    id:   eventsIdIndex || null,
                    title: eventJson['title'] || null,
                    category: Category.categoryFromJson(eventJson['category']) || null,
                    tags:Tag.tagsFromJson(json['tags']) || null,
                    catchPhrase: eventJson['catchPhrase'] || null,
                    price: eventJson['price'] || null,
                    imageLink: eventJson['imageLink'] || null,
                    iAuthors: null,
                    published: eventJson['published'] || false,
                    location: Item.getILocationFromJson(eventJson['location']) || null,
                    dates: Item.getIDatesFromJson(eventJson['dates']) || null,
                    nbRatings:  null,
                    globalNote: null,
                };

                evts.push(event);

                return event;
            }
        });
        if(evts.length<=0) return null;
        else return evts;
    }

    public static eventFromJson(json: Object): EventItem {
        if(json === null || json === undefined) return null;

        return new EventItem(
            json[0] || null,
            json['type'] || null,
            json['title'] || null,
            null,
            Tag.tagsFromJson(json['tags']) || null,
            json['catchPhrase'] || null,
            json['description'] || null,
            json['price'] || null,
            this.getILocationFromJson(json['location']) || null,
            this.getIDatesFromJson(json['dates']) || null,
            null,
            json['creationDate'] || null,
            json['published'] || false,
            json['searchContent'] || null,
            json['data'] || null,
            json['consultationLink'] || null,
            json['imageLink'] || null,
            json['videoLink'] || null,
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

        var iEvent:IEvent = {
            consultationLink:json['consultationLink'] || null,
            data:json['data'] || null,
            type:json['type']|| null,
            id: json[0]|| null,
            title: json['title']|| null,
            category:null,
            tags: Tag.tagsFromJson(json['tags']) || null,
            price: json['price'] || null,
            imageLink:json['imageLink'] || null,
            catchPhrase:json['catchPhrase'] || null,
            iAuthors:[],
            published:json['published'] || false,
            location: this.getILocationFromJson(json['location']) || null,
            dates: this.getIDatesFromJson(json['dates']) || null,
            nbRatings:  null,
            globalNote: null,
        };

        return iEvent;
    }
}
