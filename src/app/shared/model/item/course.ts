import { Database } from 'src/app/core/database/database.enum';
import { Module } from './module';
import { Category } from '../category/category';
import { Rating } from '../rating/rating';
import { IUser } from '../user/user';
import { IItem, Item } from './item';

export interface ICourse extends IItem {
    nbRatings:number;
    globalNote:number;
}   

export class Course extends Item {
    public get modules(): Module[] {
        return this._modules;
    }
    public set modules(value: Module[]) {
        this._modules = value;
    }
    public get nbClick(): number {
        return this._nbClick;
    }
    public set nbClick(value: number) {
        this._nbClick = value;
    }

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
                type:string,
                title: string, 
                category: Category,
                catchPhrase: string,
                description: string,
                price: number,
                authors:IUser[],
                creationDate: string, 
                published:boolean,
                private _modules: Module[],
                searchContent:string,
                data:boolean,
                private _skillsToAcquire: string[],
                private _ratings: Rating[],
                private _nbClick?: number,
                imageLink?: string,
                videoLink?: string,
                srcLink?:string,
                private _nbRatings?: number,
                private _globalNote?: number){
        
        super(id, 
              type,
              title, 
              category,
              catchPhrase,
              description, 
              price, 
              authors,
              creationDate, 
              published,
              searchContent,
              data,
              imageLink,
              videoLink,
              srcLink);

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
            type: this.type,
            data: this.data,
            id: this.id,
            title: this.title,
            price: this.price,
            category: this.category,
            iAuthors: this.iAuthors,
            imageLink: this.imageLink,
            published: this.published,
            nbRatings:this.nbRatings,
            globalNote: this.nbRatings,
            catchPhrase:this.catchPhrase,
        }

        return iCourse;
    }


    public static getICoursesItemFromJson(json: Object): ICourse[] {

        console.log('-----------',json);

        if(json === null || json === undefined) return null;

        console.log('°°°°°°°°°°°°',json);

        var crs:ICourse[] = [];
        Object.keys(json).map(
            function(coursesIdIndex){
            let courseJson = json[coursesIdIndex];

            if(courseJson['type']==='course') {

                var course:ICourse = {
                    data:courseJson['data'],
                    type:courseJson['type'],
                    id: coursesIdIndex,
                    title: courseJson['title'],
                    category:null,
                    price: courseJson['price'],
                    imageLink:courseJson['imageLink'],
                    nbRatings:courseJson['nbRatings'],
                    catchPhrase:courseJson['catchPhrase'],
                    globalNote:courseJson['globalNote'],
                    iAuthors:[],
                    published:courseJson['published'],
                };
                crs.push(course);
                return course;
            }
        });
        if(crs.length<=0) return null;
        else return crs;
    }

    public static courseFromJson(json: Object): Course {

        if(json === null || json === undefined) return null;

        console.log(json);

        return new Course(
            json['id'],
            json['type'],
            json['title'],
            null,
            json['catchPhrase'],
            json['description'],
            json['price'],
            [],
            json['creationDate'],
            json['published'],
            Module.modulesFromJson(json[Database.MODULES.substr(1)]),
            json['searchContent'],
            json['data'],
            json['skillsToAcquire'],
            Rating.ratingsFromJson(json['ratings']),
            json['nbClick'],
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
