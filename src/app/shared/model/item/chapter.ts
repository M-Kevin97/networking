export class Chapter {
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

    constructor(private _id: string,
                private _title: string) {

    }

    public static chaptersFromJson(json: Object): Chapter[] {

        if(json === null || json === undefined) return null;

        console.log('chaptersFromJson', json);

        var chapters = Object.keys(json).map(
            function(chaptersIdIndex){
            let chapterJson = json[chaptersIdIndex];

            var chapter:Chapter = Chapter.chapterFromJson(chapterJson);

            return chapter;
        });

        return chapters;
    }

    public static chapterFromJson(json:Object):Chapter{

        if(json === null && json === undefined) return null;

        console.log('chapterFromJson', json);

        return new Chapter(json[0],
                           json['title']);
    }

}
