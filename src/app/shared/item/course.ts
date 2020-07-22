import { Item, IItem } from 'src/app/shared/item/item';
import { Category } from './category/category';
import { Rating } from '../rating/rating';
import { IUser, User } from '../user/user';

export interface ICourse extends IItem {
    nbRatings:number;
    overallRating:number;
}   

export class Course extends Item {
    public get overallRating(): number {
        return this._overallRating;
    }
    public set overallRating(value: number) {
        this._overallRating = value;
    }
    public get nbRatings(): number {
        return this._nbRatings;
    }
    public set nbRatings(value: number) {
        this._nbRatings = value;
    }
    public get skillsToAcquire(): string[] {
        return this._skillsToAcquire;
    }

    public set skillsToAcquire(value: string[]) {
        this._skillsToAcquire = value;
    }

    public get ratings(): Rating[] {
        return this._ratings;
    }
    public set ratings(value: Rating[]) {
        this._ratings = value;
    }

    constructor(id: string, 
                title: string, 
                category: Category,
                catchPhrase: string,
                description: string,
                price: number,
                authors:IUser[],
                creationDate: string, 
                published:boolean,
                private _skillsToAcquire: string[],
                private _ratings: Rating[],
                imageLink?: string,
                videoLink?: string,
                private _nbRatings?: number,
                private _overallRating?: number){
        
        super(id, 
              title, 
              category,
              catchPhrase,
              description, 
              price, 
              authors,
              creationDate, 
              published,
              imageLink,
              videoLink);
    }

    public static getICoursesItemFromJson(json: Object): ICourse[] {

        console.log(json);

        if(json === null || json === undefined) return null;

        var courses = Object.keys(json).map(
            function(coursesIdIndex){
            let courseJson = json[coursesIdIndex];

            var course:ICourse = {
                type:'ICourse',
                id: coursesIdIndex,
                title: courseJson['title'],
                category:Category.categoryFromJson(courseJson['category']),
                price: courseJson['price'],
                imageLink:courseJson['imageLink'],
                nbRatings:courseJson['nbRatings'],
                overallRating:courseJson['overallRating'],
                authors:Item.getIAuthorsItemFromJson(courseJson['authors']),
                published:courseJson['published'],
            };
            return course;
        });

        return courses;
    }

    public static courseFromJson(json: Object): Course {

        if(json === null || json === undefined) return null;

        console.log(json);

        return new Course(
           null,
            json['title'],
            Category.categoryFromJson(json['category']),
            json['catchPhrase'],
            json['description'],
            json['price'],
            this.getIAuthorsItemFromJson(json['authors']),
            json['creationDate'],
            json['published'],
            json['skillsToAcquire'],
            Rating.ratingsFromJson(json['rating']),
            json['imageLink'],
            json['videoLink']
        );
    }

    public static coursesFromJson(json: Object): Course[] {

        console.log(json);

        if(json === null || json === undefined) return [];
        
        console.log(json);

        var courses = Object.keys(json).map(
            function(coursesIdIndex){
            let courseJson = json[coursesIdIndex];

            var course = Course.courseFromJson(courseJson)
            course.id = coursesIdIndex;

            return course;
        });

        return courses;
    }
}
