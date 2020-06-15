import { Category } from './category';

export class Item {
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
    public get idAuthor(): string {
        return this._idAuthor;
    }
    public set idAuthor(value: string) {
        this._idAuthor = value;
    }
    public get firstnameAuthor(): string {
        return this._firstnameAuthor;
    }
    public set firstnameAuthor(value: string) {
        this._firstnameAuthor = value;
    }
    public get lastnameAuthor(): string {
        return this._lastnameAuthor;
    }
    public set lastnameAuthor(value: string) {
        this._lastnameAuthor = value;
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
    
    /**
    *  Variable "type" -> 0 == Formation ou 1 == Événement 
    */

   constructor( private _id: string,
                private _title: string, 
                private _category: Category,
                private _description: string,
                private _price: number,
                private _idAuthor: string,
                private _firstnameAuthor: string,
                private _lastnameAuthor: string, 
                private _imageLink?: string,
                private _videoLink?: string){
    }

    public static fromJson(json: Object): Item {
        return new Item(
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
