import { IItem, Item } from 'src/app/shared/model/item/item';
import { Tag } from './../tag/tag';
import { Database } from 'src/app/core/database/database.enum';
import { Module } from './module';
import { Category } from '../category/category';
import { Rating } from '../rating/rating';
import { IUser } from '../user/user';

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
                tags:Tag[],
                catchPhrase: string,
                description: string,
                price: number,
                authors:IUser[],
                creationDate: string, 
                published:boolean,
                private _modules: Module[],
                searchContent:string,
                data:boolean,
                consultationLink:string,
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
              tags,
              catchPhrase,
              description, 
              price, 
              authors,
              creationDate, 
              published,
              searchContent,
              data,
              consultationLink,
              imageLink,
              videoLink,
              srcLink);

        this.calculateGlobalRating();
    }

    getICourse(){

        const iCourse:IItem = {
            type:               this.type || null,
            data:               this.data || null,
            consultationLink:   this.consultationLink || null,
            id:                 this.id || null,
            title:              this.title || null,
            price:              this.price || null,
            category:           this.category || null,
            tags :              this.tags || null,
            iAuthors:           this.iAuthors || null,
            imageLink:          this.imageLink || null,
            published:          this.published || null,
            nbRatings:          this.nbRatings || null,
            globalNote:         this.globalNote || null,
            catchPhrase:        this.catchPhrase || null,
            location:           null,
            dates:              null
        }

        return iCourse;
    }

    calculateGlobalRating() {
        if(this.ratings){
            this.nbRatings = this.ratings.length;
            this.globalNote = Rating.getGlobalNote(this.ratings);
        }
        else 
        {
            this.nbRatings = 0;
            this.globalNote = 0;
        }
    }

    public static iCoursesFromJson(json: Object): IItem[] {

        console.log('-----------',json);

        if(json === null || json === undefined) return null;

        console.log('°°°°°°°°°°°°',json);

        var iCrs:IItem[] = [];
        Object.keys(json).map(
            function(coursesIdIndex){
            let courseJson = json[coursesIdIndex];

            if(courseJson['type']==='course') {

                var iCourse:IItem = this.iCourseFromJson(courseJson);

                iCrs.push(iCourse);
                
                return iCourse;
            }
        });
        if(iCrs.length<=0) return null;
        else return iCrs;
    }

    public static iCourseFromJson(json: Object): IItem {

        console.log('-----------',json);

        if(json === null || json === undefined) return null;

        console.log('°°°°°°°°°°°°',json);

        if(json['type']==='course') {

            var course:IItem = {
                consultationLink:   json['consultationLink'] || null,
                data:               json['data'] || null,
                type:               json['type'] || null,
                id:                 json[0] || null,
                title:              json['title'] || null,
                catchPhrase:        json['catchPhrase'] || null,
                category:           null,
                tags:               Tag.tagsFromJson(json['tags']) || null,
                price:              json['price'] || null,
                imageLink:          json['imageLink'] || null,
                nbRatings:          json['nbRatings'] || null,
                globalNote:         json['globalNote'] || null,
                iAuthors:           [],
                published:          json['published'] || null,
                location:           null,
                dates:              null
            };
            
            return course;
        }
    }

    public static courseFromJson(json: Object): Course {

        if(json === null || json === undefined) return null;

        console.log(json);

        return new Course(json[0],
                          json['type'] || null,
                          json['title'] || null,
                          null,
                          Tag.tagsFromJson(json['tags']) || null,
                          json['catchPhrase'] || null,
                          json['description'] || null,
                          json['price'] || null,
                          [],
                          json['creationDate'] || null,
                          json['published'] || null,
                          Module.modulesFromJson(json[Database.MODULES.substr(1)]) || null,
                          json['searchContent'] || null,
                          json['data'] || null,
                          json['consultationLink'] || null,
                          json['skillsToAcquire'] || null,
                          Rating.ratingsFromJson(json['ratings']) || null,
                          json['views'] || null,
                          json['imageLink'] || null,
                          json['videoLink'] || null,
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
