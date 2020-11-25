import { Database } from 'src/app/core/database/database.enum';
import { Chapter } from './chapter';

export class Module {
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get chapters(): Chapter[] {
        return this._chapters;
    }
    public set chapters(value: Chapter[]) {
        this._chapters = value;
    }
    public get description(): string {
        return this._description;
    }
    public set description(value: string) {
        this._description = value;
    }
    public get title(): string {
        return this._title;
    }
    public set title(value: string) {
        this._title = value;
    }

    constructor(private _id: string,
                private _title: string,
                private _description: string,
                private _chapters: Chapter[]) {

    }


    public static modulesFromJson(json: Object): Module[] {

        if(json === null || json === undefined) return null;

        //console.warn('modulesFromJson', json);

        var modules = Object.keys(json).map(
            function(modulesIdIndex){
            let moduleJson = json[modulesIdIndex];

            var module = Module.moduleFromJson(moduleJson)
            module.id = modulesIdIndex;

            return module;
        });

        return modules;
    }

    public static moduleFromJson(json:Object):Module{

        //console.warn('moduleFromJson', json);

        if(json === null && json === undefined) return null;

        return new Module(json[0],
                          json['title'],
                          json['description'],
                          Chapter.chaptersFromJson(json[Database.CHAPTERS.substr(1)]));
    }
}
