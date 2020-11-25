import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Module } from 'src/app/shared/model/item/module';


@Component({
  selector: 'app-course-content',
  templateUrl: './course-content.component.html',
  styleUrls: ['./course-content.component.scss'],
})
export class CourseContentComponent implements OnInit, OnChanges {

  @Input() courseContent:Module[] = [];
  isModuleExpandedArray:boolean[] = [];

  courseModules:Subject<Module[]> = new BehaviorSubject(this.courseContent);
 

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {

   // console.log('ngOnInit');
  }

  initIsModuleExpandedArray() {

    for(let i = 0; i<this.courseContent.length; i++) {
      this.isModuleExpandedArray.push(false);
    }
  }

  isModuleExpanded(iModule:number) {

   return this.isModuleExpandedArray[iModule];
  }

  setIsModuleExpanded(iModule:number, bool:boolean) {

    this.isModuleExpandedArray[iModule] = bool;
   }

  ngOnChanges(): void {

    //console.log('ngOnChanges', typeof this.courseContent);

    if(this.courseContent && typeof this.courseContent === 'object') {
      var cont = this.courseContent;
      var resultArray = Object.keys(cont).map(function(key){
        let content = cont[key];
        //console.log(cont[0], content);
        // do something with person
        return content;
      });

      if(!this.isModuleExpandedArray) this.isModuleExpandedArray = []
      else if(!this.isModuleExpandedArray.length) this.isModuleExpandedArray.splice(0, this.isModuleExpandedArray.length);

      this.initIsModuleExpandedArray();

      //console.log(resultArray);
      this.courseModules.next(resultArray);

    } else {
      this.courseModules.next(this.courseContent);
    }

    this.changeDetectorRef.detectChanges();
  }

}
