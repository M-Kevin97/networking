import { Item, IItem } from 'src/app/shared/item/item';
import { Category } from 'src/app/shared/item/category/category';
import { IUser, User } from '../user/user';

export interface LocationEvent {
    location: string;
    address: string;
    zip: number;
    city: string;
    country: string;
  }

export interface IEvent extends IItem {
    
}   


export class EventItem extends Item {

    constructor(id: string, 
                title: string, 
                category:Category,
                description: string,
                price: number,
                authors:IUser[],
                creationDate: string, 
                published:boolean, 
                imageLink?: string,
                videoLink?: string){

        super(id, 
                title,
                category,
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
                category:Category.categoryFromJson(eventJson['categories']),
                imageLink: eventJson['imageLink'],
                authors:this.getIAuthorsItemFromJson(eventJson['authors']),
                published: eventJson['published'],
            };
            return event;
        });

        return events;
    }

    public static eventFromJson(json: Object): EventItem {
        return new EventItem(
            json['id'],
            json['title'],
            Category.categoryFromJson(json['categories']),
            json['description'],
            json['price'],
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
