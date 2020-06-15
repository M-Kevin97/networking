import { Item } from 'src/app/models/item';
import { Category } from './category';

export class EventItem extends Item {

    constructor(id: string, title: string, 
        type: number,
        category:Category,
        description: string,
        price: number,
        idAuthor: string,
        firstnameAuthor: string,
        lastnameAuthor: string, 
        imageLink?: string,
        videoLink?: string){

        super(id, 
            title,
            category,
            description, 
            price, 
            idAuthor, 
            firstnameAuthor, 
            lastnameAuthor, 
            imageLink,
            videoLink);
    }

}
