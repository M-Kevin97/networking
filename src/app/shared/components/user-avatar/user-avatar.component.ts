import { Component, ElementRef, Input, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, AfterContentChecked } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-user-avatar',
  templateUrl: './user-avatar.component.html',
  styleUrls: ['./user-avatar.component.scss']
})
export class UserAvatarComponent implements OnInit, AfterViewInit {

  @ViewChild('circle') circleElement: ElementRef;

  @Input()
  public photoUrl: string = null;
  @Input()
  public name: string = '';
  @Input()
  public border: string = '';

  public showInitials = false;
  public initials: string;

  circleWidth:Subject<number> = new BehaviorSubject(0);

  constructor(private cdr: ChangeDetectorRef){}

  ngOnInit() {

    if (!this.photoUrl) {
      this.showInitials = true;
      this.createInititals();
    }
  }

  ngAfterViewInit() {
    var size =  this.circleElement.nativeElement.offsetWidth ? this.circleElement.nativeElement.offsetWidth*3 : 250;
    this.circleWidth.next(size);
    this.cdr.detectChanges();
  }

  private createInititals(): void {
    let initials = "";

    for (let i = 0; i < this.name.length; i++) {
      if (this.name.charAt(i) === ' ') {
          continue;
      }

      if (this.name.charAt(i) === this.name.charAt(i).toUpperCase()) {
          initials += this.name.charAt(i);

        if (initials.length == 2) {
            break;
        }
      }
    }

    this.initials = initials;
  }
}