import { Component, OnInit, Input } from '@angular/core';
import { IItem } from 'src/app/shared/model/item/item';

@Component({
  selector: 'app-items-carousel',
  templateUrl: './items-carousel.component.html',
  styleUrls: ['./items-carousel.component.css']
})
export class ItemsCarouselComponent implements OnInit {

  @Input() iItems:IItem[];
  iItems2d:IItem[][];

  constructor() { }

  convert1DTo2DArray() {
    if(!this.iItems) return null;
    const newArr = [];
    var array = Array.from(this.iItems);
    while(array.length) newArr.push(array.splice(0,4));
        
    console.log(newArr);

    this.iItems2d = newArr;
  }

  ngOnInit() {    

    this.convert1DTo2DArray();
  }

}
