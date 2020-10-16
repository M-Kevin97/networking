export class Category {
    public get subCategories(): Category[] {
        return this._subCategories;
    }
    public set subCategories(value: Category[]) {
        this._subCategories = value;
    }
    
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
                private _name: string,
                private _subCategories: Category[]){}

    public static categoryFromJson(json: Object): Category {
        
        if(json === null || json === undefined) return null;

        const id:string = Object.keys(json)[0];
        const cat:string = json[id];

        return new Category(
            id,
            cat['name'],
            this.categoriesFromJson(cat['sub_categories']));
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
