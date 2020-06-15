import { Category } from './category';
import { Item } from './item';

export class Course extends Item {

    public get rating(): number {
        return this._rating;
    }
    public set rating(value: number) {
        this._rating = value;
    }

    constructor(id: string, 
                title: string, 
                category: Category,
                description: string,
                price: number,
                idAuthor: string,
                firstnameAuthor: string,
                lastnameAuthor: string, 
                private _rating: number,
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

    public static courseFromJson(json: Object): Course {
        return new Course(
            json['id'],
            json['title'],
            json['description'],
            json['price'],
            json['idAuthor'],
            json['firstnameAuthor'],
            json['lastnameAuthor'],
            json['imageLink'],
            json['videoLink']
        );
    }
    
}
