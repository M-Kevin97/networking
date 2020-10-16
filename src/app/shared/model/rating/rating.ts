import { IUser, User } from 'src/app/shared/model/user/user';

export class Rating {
    public get author(): IUser {
        return this._author;
    }
    public set author(value: IUser) {
        this._author = value;
    }
    public get publicationDate(): string {
        return this._publicationDate;
    }
    public set publicationDate(value: string) {
        this._publicationDate = value;
    }

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
                private _comment: string,
                private _publicationDate: string,
                private _author: IUser){ }

    public static getGlobalNote(ratings:Rating[]):number {

        if(!ratings) return;
       var notes = {
        one: 0,
        two: 0,
        three: 0,
        four: 0,
        five: 0,
       }

        
        for(let rating of ratings) {
            switch(rating.note){
                case 1 :  {
                    notes.one++;
                    break;
                }
                case 2 :  {
                    notes.two++;
                    break;
                }
                case 3 :  {
                    notes.three++;
                    break;
                }
                case 4 :  {
                    notes.four++;
                break;
                }
                case 5 :  {
                    notes.five++;
                    break;
                }
            }
        }

        var globalNote:number;
        const num = ((notes.one*1)+(notes.two*2)+(notes.three*3)+(notes.four*4)+(notes.five*5))
        if (num===0) globalNote = 0;
        else {
          const den = (notes.one+notes.two+notes.three+notes.four+notes.five);
          globalNote = num/den;
          globalNote = Math.round(globalNote * 10) / 10
        }

        return globalNote
        }

    public static ratingFromJson(json:Object):Rating{

        if(json === null && json === undefined) return null;

        return new Rating(json[0],
                          json['note'],
                          json['comment'],
                          json['publicationDate'],
                          this.getIAuthorFromRatingJson(json['author']));
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

    public static getIAuthorFromRatingJson(json: Object): IUser {

        if(json === null || json === undefined) return null;

        console.log(json);

        const id:string = Object.keys(json)[0];
        const userJson:string = json[id];

        var author:IUser = {
            id: id,
            firstname: userJson['firstname'],
            lastname: userJson['lastname'],
            title: userJson['title'],
            ppLink: userJson['ppLink'],
            bio: userJson['bio'],
            data: userJson['data'],
        };

        return author;
    }
}
