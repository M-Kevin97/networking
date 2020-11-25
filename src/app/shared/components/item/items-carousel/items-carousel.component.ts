import { ItemService } from 'src/app/shared/service/item/item.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit, AfterViewChecked } from '@angular/core';
import { IItem } from 'src/app/shared/model/item/item';
import { IUser } from 'src/app/shared/model/user/user';

@Component({
  selector: 'app-items-carousel',
  templateUrl: './items-carousel.component.html',
  styleUrls: ['./items-carousel.component.css']
})
export class ItemsCarouselComponent implements OnInit, OnChanges, AfterViewInit{

  @ViewChild('container') carousel: ElementRef;

  @Input() iItems:    IItem[];
  @Input() iAuthor:   IUser;
  @Input() item_type: string = 'course';

  iItems2d:            IItem[][];
  cardItemHeight:      number = 17;
  cardItemWidthBrut:   number = 14.3;
  cardItemWidthNet:    number = 13;
  cardItemMarginRight: number = 0;

  constructor() { }

  ngAfterViewInit(): void {
    
    console.log('ngAfterViewChecked');
    this.convert1DTo2DArray();
  }


  ngOnInit() {    

    console.log('ngOnInit');
  }


  ngOnChanges(changes: SimpleChanges): void {

  }

  convert1DTo2DArray() {
    if(!this.iItems) return null;
    const newArr = [];
    var array = Array.from(this.iItems);
    
    let cWidthBrut = +this.carousel.nativeElement.offsetWidth;
    // let cWidthNet = cWidthBrut - 150;
    // let nbCarouselCol = 3;
    // let colWidth = cWidthNet / nbCarouselCol;

    let cardW = this.cardItemWidthBrut * 16;
    let nbCarouselCol = Math.floor(cWidthBrut / cardW);
    this.cardItemMarginRight = Math.floor(((cWidthBrut - (this.cardItemWidthNet*16 * nbCarouselCol))/(nbCarouselCol-1))/16);

    // while(colWidth < 145 && colWidth > 185 && nbCarouselCol >= 1) {

    //   console.log('nbCarouselCol', nbCarouselCol, colWidth);

    //   if(colWidth < 145) {
    //     colWidth = 145;
    //     nbCarouselCol--;
    //   }
    //   else if(colWidth > 185) {
    //     colWidth = 185;
    //     nbCarouselCol++;
    //   }

    //   colWidth = cWidthNet / nbCarouselCol;

    //   console.log('nbCarouselCol', nbCarouselCol, colWidth);

    // }

    //this.cardItemWidth = colWidth+'px';

    while(array.length) newArr.push(array.splice(0, nbCarouselCol));
        
    // console.log(newArr);

     this.iItems2d = newArr;
  }

  

}
