import { ItemService } from 'src/app/shared/service/item/item.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
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

  iItems2d:         IItem[][];
  cardItemHeight:   string;
  cardItemWidth:    string;


  constructor(private itemService:ItemService) { }

  ngAfterViewInit(): void {

    console.log('ngOnInit');
    this.convert1DTo2DArray();
  }

  ngOnInit() {    

    console.log('ngOnInit');
  }


  ngOnChanges(changes: SimpleChanges): void {

    console.log('ngOnChanges',changes);

  }


  convert1DTo2DArray() {
    if(!this.iItems) return null;
    const newArr = [];
    var array = Array.from(this.iItems);
    
    let cWidthBrut = +this.carousel.nativeElement.width;
    let cWidthNet = cWidthBrut - 150;
    let nbCarouselCol = 3;
    let colWidth = cWidthNet / nbCarouselCol;


    while(colWidth < 145 && colWidth > 185 && nbCarouselCol >= 1) {

      console.log('nbCarouselCol', nbCarouselCol, colWidth);

      if(colWidth < 145) {
        colWidth = 145;
        nbCarouselCol--;
      }
      else if(colWidth > 185) {
        colWidth = 185;
        nbCarouselCol++;
      }

      colWidth = cWidthNet / nbCarouselCol;

      console.log('nbCarouselCol', nbCarouselCol, colWidth);

    }

    this.cardItemWidth = colWidth+'px';
    this.cardItemHeight = '16.5em'; 

    while(array.length) newArr.push(array.splice(0, nbCarouselCol));
        
    console.log(newArr);

    this.iItems2d = newArr;
  }

  

}
