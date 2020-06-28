export class Rating {
    public get note(): number {
        return this._note;
    }
    public set note(value: number) {
        this._note = value;
    }
    public get comment(): string {
        return this._comment;
    }
    public set comment(value: string) {
        this._comment = value;
    }
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }

    constructor(private _id: string,
                private _note: number,
                private _comment: string,){

    }

    public static ratingFromJson(json:Object):Rating{

        if(json === null && json === undefined) return null;

        return new Rating(json[0],
                          json['note'],
                          json['comment']);

    }

    public static ratingsFromJson(json: Object): Rating[] {

        if(json === null || json === undefined) return null;

        console.log(json);

        var ratings = Object.keys(json).map(
            function(ratingsIdIndex){
            let ratingJson = json[ratingsIdIndex];

            var rating = Rating.ratingFromJson(ratingJson)
            rating.id = ratingsIdIndex;

            return rating;
        });

        return ratings;
    }
}
