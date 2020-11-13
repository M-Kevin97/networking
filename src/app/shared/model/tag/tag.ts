import { View } from '../item/view';

export class Tag {
    public get views(): View[] {
        return this._views;
    }
    public set views(value: View[]) {
        this._views = value;
    }
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }

    constructor(private _id: string,
                private _name: string,
                private _views: View[]){ }

    public static tagFromJson(json:Object): Tag{

        if(json === null && json === undefined) return null;

        return new Tag(json[0],
                       json['name'],
                       json['views']);
    }

    public static tagsFromJson(json: Object): Tag[] {

        if(json === null || json === undefined) return null;

        console.log(json);

        var tags = Object.keys(json).map(
            function(tagIdIndex){
            let tagJson = json[tagIdIndex];

            var tag = Tag.tagFromJson(tagJson)
            tag.id = tagIdIndex;

            return tag;
        });

        return tags;
    }
}
