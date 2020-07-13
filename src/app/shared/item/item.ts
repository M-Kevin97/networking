import { Category } from 'src/app/shared/item/category/category';
import { IUser, User } from '../user/user';

export interface IItem {
    id:string;
    title:string;
    price:number;
    category:Category;
    authors:IUser[];
    imageLink:string;
    published:boolean;
}

export class Item {
    public get catchPhrase(): string {
        return this._catchPhrase;
    }
    public set catchPhrase(value: string) {
        this._catchPhrase = value;
    }
    public get published(): boolean {
        return this._published;
    }
    public set published(value: boolean) {
        this._published = value;
    }
 
    public get authors(): IUser[] {
        return this._authors;
    }
    public set authors(value: IUser[]) {
        this._authors = value;
    }

    public get creationDate(): string {
        return this._creationDate;
    }
    public set creationDate(value: string) {
        this._creationDate = value;
    }
    public get category(): Category {
        return this._category;
    }
    public set category(value: Category) {
        this._category = value;
    }
    public get title(): string {
        return this._title;
    }
    public set title(value: string) {
        this._title = value;
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
    public get price(): number {
        return this._price;
    }
    public set price(value: number) {
        this._price = value;
    }
    public get imageLink(): string {
        return this._imageLink;
    }
    public set imageLink(value: string) {
        this._imageLink = value;
    }
    public get videoLink(): string {
        return this._videoLink;
    }
    public set videoLink(value: string) {
        this._videoLink = value;
    }

   constructor( private _id: string,
                private _title: string, 
                private _category: Category,
                private _catchPhrase: string,
                private _description: string,
                private _price: number,
                private _authors: IUser[],
                private _creationDate: string, 
                private _published: boolean,
                private _imageLink?: string,
                private _videoLink?: string){
    }

    protected static getIAuthorsItemFromJson(json: Object): IUser[] {

        if(json === null && json === undefined) return null;

        console.log(json);

        var authors = Object.keys(json).map(
            function(authorsIdIndex){
            let userJson = json[authorsIdIndex];
            console.log(userJson);
            var author:IUser = {
                id: authorsIdIndex,
                firstname: userJson['firstname'],
                lastname: userJson['lastname'],
            };
            return author;
        });

        return authors;
    }

    public static itemFromJson(json: Object): Item {

        if(json === null && json === undefined) return null;

        return new Item(
            json['id'],
            json['title'],
            Category.categoryFromJson(json['category']),
            json['catchPhrase'],
            json['description'],
            json['price'],
            this.getIAuthorsItemFromJson(json['authors']),
            json['creationDate'],
            json['published'],
            json['imageLink'],
            json['videoLink']
        );
    }
}
