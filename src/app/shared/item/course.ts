import { Item, IItem } from 'src/app/shared/item/item';
import { Category } from './category/category';
import { Rating } from '../rating/rating';
import { IUser } from '../user/user';

export interface ICourse extends IItem {
    nbRatings:number;
    overallRating:number;
}   

export class Course extends Item {

    public get globalNote(): number {
        return this._globalNote;
    }

    public set globalNote(value: number) {
        this._globalNote = value;
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
                searchContent:string,
                private _skillsToAcquire: string[],
                private _ratings: Rating[],
                imageLink?: string,
                videoLink?: string,
                private _nbRatings?: number,
                private _globalNote?: number){
        
        super(id, 
              title, 
              category,
              catchPhrase,
              description, 
              price, 
              authors,
              creationDate, 
              published,
              searchContent,
              imageLink,
              videoLink);

              if(this.ratings){
                this.nbRatings = this.ratings.length;
                this.globalNote = Rating.getGlobalNote(this.ratings);
              }
              else {
                this.nbRatings = 0;
                this.globalNote = 0;
              }
    }

    getICourse(){
        const iCourse:ICourse = {
            type: 'ICourse',
            id: this.id,
            title: this.title,
            price: this.price,
            category: this.category,
            authors: this.authors,
            imageLink: this.imageLink,
            published: this.published,
            nbRatings:this.nbRatings,
            overallRating: this.nbRatings,

        }


        return iCourse;
    }


    public static getICoursesItemFromJson(json: Object): ICourse[] {

        console.log('-----------',json);

        if(json === null || json === undefined) return null;

        console.log('°°°°°°°°°°°°',json);

        var crs:ICourse[] = [];
        var courses = Object.keys(json).map(
            function(coursesIdIndex){
            let courseJson = json[coursesIdIndex];

            if(courseJson['type']==='course') {

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
                crs.push(course);
                return course;
            }
        });
        if(courses.length<=0) return null;
        else return courses;
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
            json['searchContent'],
            json['skillsToAcquire'],
            Rating.ratingsFromJson(json['ratings']),
            json['imageLink'],
            json['videoLink']
        );
    }

    public static coursesFromJson(json: Object): Course[] {

        console.log(json);

        if(json === null || json === undefined) return null;

        var courses: Course[] = Object.keys(json).map(
            function(coursesIdIndex){
            let courseJson = json[coursesIdIndex];
        
            console.log(json);

            var course = Course.courseFromJson(courseJson)
            course.id = coursesIdIndex;

            return course;
        });

        console.log('courses',courses);

        return courses;
    }
}
