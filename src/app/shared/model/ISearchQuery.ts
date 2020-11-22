export interface ISearchQuery {
    categoryId: string;
    query: string;
    item: string;
    sortBy: string;
  };
  
  export enum ItemResult {
    ITEMS = "items",
    USERS = "users",
    EVENTS = "evts",
    COURSES = "crs"
  };
  
  export enum SearchQueryName {
    QUERY = "k",
    CATEGORY = "cat",
    ITEM = "i",
    SORT_OPTION = 's_o'
  };
  
  export enum DefautCategory {
    NAME = "Toutes les catégories",
    ID = "0",
  };

  export interface ISortOption {
    name:string,
    id:string,
  };
  