export class Category {
    
    public get id(): string {
        return this._id;
    }
    public set id(value: string) {
        this._id = value;
    }
    public get name(): string {
        return this._name;
    }
    public set name(value: string) {
        this._name = value;
    }

    constructor(private _id: string,
                private _name: string){}

    public static categoryFromJson(json: Object): Category {
        
        if(json === null || json === undefined) return null;

        console.log();
        console.log(json);

        

        return new Category(
            Object.keys(json)[0],
            json['name']
        );
    }

    public static categoriesFromJson(json: Object): Category[] {

        if(json === null || json === undefined) return null;

        var categories = Object.keys(json).map(
            function(categoriesIdIndex){
            let categoryJson = json[categoriesIdIndex];

            var category = Category.categoryFromJson(categoryJson)
            category.id = categoriesIdIndex;

            return category;
        });

        return categories;
    }
}
