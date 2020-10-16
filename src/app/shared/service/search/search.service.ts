import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { DefautCategory, ISearchQuery, ItemResult, SearchQueryName } from '../../model/ISearchQuery';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  item:ItemResult;
  categorySelectedId: string = '';
  query:string = '';
  sortOptionSelectedName:string = '';
  searchSubject = new Subject<ISearchQuery>();

  // ---------------- Search query ----------------
  currentSearchQuery:ISearchQuery;

  constructor(private router: Router) {

    this.currentSearchQuery = {
      categoryId:this.categorySelectedId,
      query:'',
      sortBy:'',
      item:''
    };
   }

  search(categoryId:string, query:string, item?:string, sortOption?:string) {

    if(categoryId || query || item || sortOption){
      this.categorySelectedId = categoryId;

      let sk:ISearchQuery = {
        categoryId:this.categorySelectedId ? this.categorySelectedId: DefautCategory.ID,
        query: query ? query: '',
        sortBy: sortOption ? sortOption: '',
        item: item ? item: '',
      };

      this.currentSearchQuery = sk;

      if(query) this.searchByQuery(sk);
      else this.searchByCategory(sk);

    }
  }

  private searchByCategory(event:ISearchQuery) {
    if(event.categoryId && event.sortBy && event.item){
      this.router.navigate([RouteUrl.RESULTS], { 
        queryParams: { 
          [SearchQueryName.CATEGORY]: event.categoryId,
          [SearchQueryName.ITEM]: event.item,
          [SearchQueryName.SORT_OPTION]: event.sortBy,
        }
      });
    } else if(event.categoryId && event.sortBy){
      this.router.navigate([RouteUrl.RESULTS], { 
        queryParams: { 
          [SearchQueryName.CATEGORY]: event.categoryId,
          [SearchQueryName.SORT_OPTION]: event.sortBy,
        }
      });
    } else if(event.categoryId){
      this.router.navigate([RouteUrl.RESULTS], { 
        queryParams: { 
          [SearchQueryName.CATEGORY]: event.categoryId,
        }
      });
    } else this.searchAll();
  }

  private searchByQuery(event:ISearchQuery) {
    // si k et cat
    if(event.query && event.categoryId){

      if(event.sortBy && event.item){
        this.router.navigate([RouteUrl.RESULTS], { 
          queryParams: { 
            [SearchQueryName.QUERY]: event.query,
            [SearchQueryName.CATEGORY]: event.categoryId,
            [SearchQueryName.ITEM]: event.item,
            [SearchQueryName.SORT_OPTION]: event.sortBy,
          }
        });
      } else if(event.sortBy){
        this.router.navigate([RouteUrl.RESULTS], { 
          queryParams: { 
            [SearchQueryName.QUERY]: event.query,
            [SearchQueryName.CATEGORY]: event.categoryId,
            [SearchQueryName.SORT_OPTION]: event.sortBy,
          }
        });
      } else {
        this.router.navigate([RouteUrl.RESULTS], { 
          queryParams: { 
            [SearchQueryName.QUERY]: event.query,
            [SearchQueryName.CATEGORY]: event.categoryId,
          }
        });
      }
    } 
  }

  searchAll() {
    this.router.navigate([RouteUrl.RESULTS], { 
      queryParams: { 
        [SearchQueryName.CATEGORY]: DefautCategory.NAME,
      }
    });
  }
}
