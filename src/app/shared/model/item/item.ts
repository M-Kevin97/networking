import { IUser } from 'src/app/shared/model/user/user';
import { Category } from '../category/category';
import { Tag } from '../tag/tag';
import { ILocationEvent, IDatesEvent } from './event-item';


export interface IItem {
    data:boolean;
    type:string;
    id:string;
    title:string;
    catchPhrase:string;
    price:number;
    category:Category;
    tags:Tag[];
    iAuthors:IUser[];
    imageLink:string;
    published:boolean;
    consultationLink:string;
    nbRatings:  number;
    globalNote: number;
    location:ILocationEvent;
    dates:IDatesEvent;
}

export class Item {
    public get consultationLink(): string {
        return this._consultationLink;
    }
    public set consultationLink(value: string) {
        this._consultationLink = value;
    }
    public get tags(): Tag[] {
        return this._tags;
    }
    public set tags(value: Tag[]) {
        this._tags = value;
    }
    public get data(): boolean {
        return this._data;
    }
    public set data(value: boolean) {
        this._data = value;
    }
    public get srcLink(): string {
        return this._srcLink;
    }
    public set srcLink(value: string) {
        this._srcLink = value;
    }
    public get type(): string {
        return this._type;
    }
    public set type(value: string) {
        this._type = value;
    }
    public get searchContent(): string {
        return this._searchContent;
    }
    public set searchContent(value: string) {
        this._searchContent = value;
    }
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
 
    public get iAuthors(): IUser[] {
        return this._iAuthors;
    }
    public set iAuthors(value: IUser[]) {
        this._iAuthors = value;
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
                private _type: string,
                private _title: string, 
                private _category: Category,
                private _tags: Tag[],
                private _catchPhrase: string,
                private _description: string,
                private _price: number,
                private _iAuthors: IUser[],
                private _creationDate: string, 
                private _published: boolean,
                private _searchContent: string,
                private _data: boolean,
                private _consultationLink: string,
                private _imageLink?: string,
                private _videoLink?: string,
                private _srcLink?: string){
    }

    setMainiAuthor(iUser:IUser){
        if(this.iAuthors)
        {
            this.iAuthors[0] = iUser;
        }
    }

    getMainiAuthor(){
        if(this.iAuthors)
        {
            return this.iAuthors[0];
        }
    }

    getMainiAuthorName() {
        if(this.iAuthors)
        {
          return this.iAuthors[0].firstname+" "+this.iAuthors[0].lastname;
        }
    }


    public static getILocationFromJson(json: Object): ILocationEvent {

        if(json === null || json === undefined) return null;

        const location:ILocationEvent = {

            location: json['location'],
            address: json['address'],
            zip: json['zip'],
            city: json['city'],
            country: json['country']
          }

        return location;
    }


    public static  getIDatesFromJson(json: Object): IDatesEvent {

        if(json === null || json === undefined) return null;

        const dates:IDatesEvent = {
            startDate: json['startDate'],
            endDate: json['endDate']
          }

        return dates;
    }
}
