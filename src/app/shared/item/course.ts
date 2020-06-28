import { Item, IItem } from 'src/app/shared/item/item';
import { Category } from './category/category';
import { Rating } from '../rating/rating';
import { IUser, User } from '../user/user';

export interface ICourse extends IItem {
    nbRatings:number;
    overallRating:number;
}   

export class Course extends Item {

    public get ratings(): Rating[] {
        return this._ratings;
    }
    public set rating(value: Rating[]) {
        this._ratings = value;
    }

    constructor(id: string, 
                title: string, 
                category: Category,
                description: string,
                price: number,
                authors:IUser[],
                creationDate: string, 
                published:boolean,
                private _ratings: Rating[],
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

    public static getICoursesItemFromJson(json: Object): ICourse[] {

        if(json === null || json === undefined) return null;
        console.log(json);

        var courses = Object.keys(json).map(
            function(coursesIdIndex){
            let courseJson = json[coursesIdIndex];

            var course:ICourse = {
                id: coursesIdIndex,
                title: courseJson['title'],
                category:Category.categoryFromJson(json['categories']),
                imageLink:courseJson['imageLink'],
                nbRatings:courseJson['nbRatings'],
                overallRating:courseJson['overallRating'],
                authors:this.getAuthorsItemFromJson(courseJson['authors']),
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
            json['description'],
            json['price'],
            this.getIAuthorsItemFromJson(json['authors']),
            json['creationDate'],
            json['published'],
            Rating.ratingsFromJson(json['rating']),
            json['imageLink'],
            json['videoLink']
        );
    }

    public static coursesFromJson(json: Object): Course[] {

        console.log(json);

        if(json === null && json === undefined) return null;
        
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
