import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ItemFormService } from 'src/app/item-form/shared/services/item-form.service';
import { StepState } from 'src/app/item-form/shared/state-step.enum';
import { IDatesEvent, EventItem } from 'src/app/shared/model/item/event-item';

@Component({
  selector: 'app-event-date-form',
  templateUrl: './event-date-form.component.html',
  styleUrls: ['./event-date-form.component.scss']
})
export class EventDateFormComponent implements OnInit {

  public get itemFormService(): ItemFormService {
    return this._itemFormService;
  }

  datesForm: FormGroup;
  endDateInf:boolean;

  currentDate:string = null;
  currentTime:string = null;
  defaultEndTime:string = null;

  constructor(private formBuilder: FormBuilder,
              private _itemFormService: ItemFormService) {}


  ngOnInit() {

    this.endDateInf = false;

    this.setFormWithCurrentDateAndHour();

    this.datesForm = this.formBuilder.group({
      startDate: [this.currentDate, [Validators.required]],
      startTime: [this.currentTime, [Validators.required]],
      endDate: [this.currentDate, [Validators.required]],
      endTime: [this.getDefaultEndTime(this.currentTime), [Validators.required]]
    });

    //   // sinon si l'élément a été créé
    // if(this.itemFormService.mapStepForms.has(StepState.DATES)){
    // if(this.itemFormService.getStepFormWithStep(StepState.DATES).status){
    //     this.onRestoreDatesForm(this.itemFormService.getStepFormWithStep(StepState.DATES).value);
    //   }
    // }
    // // sinon si les éléménts précédents n'ont pas été créé, retourner au début
    // else if (this.itemFormService.mapStepForms.size === 0){
    //   this.itemFormService.onStartToTheBeginning();
    // }
  }

  setFormWithCurrentDateAndHour() {

    this.currentDate = this.formatDateForInput(new Date());
    this.currentTime = this.formatTimeForInput(new Date());

    console.error(this.currentDate);
    console.error(this.currentTime);
  }

  formatDateForInput(date:Date) {

    if(!date) date = new Date();

    var month = '' + (date.getMonth() + 1),
        day = '' + date.getDate(),
        year = date.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
  }

  formatTimeForInput(datetime:Date) {

    if(!datetime) datetime = new Date();

    var hour = '' + (datetime.getHours()),
        minute = '' + datetime.getMinutes(),
        second = '00';

    if (hour.length < 2) 
        hour = '0' + hour;
    if (minute.length < 2) 
        minute = '0' + minute;

    return [hour, minute, second].join(':');
  }

  getDefaultEndTime(startTime:string) {


    if(!startTime) return '00:00:00';

    let time = startTime.split(':');

    var hour = '' + (+time[0]+2),
        minute = '' + time[1],
        second = '00';

    if (hour.length < 2) 
        hour = '0' + hour;
    if (minute.length < 2) 
        minute = '0' + minute;

    return [hour, minute, second].join(':');
  }

  getUTCFullDate(date:Date) : string {

    const UTCYear = (date.getUTCFullYear() <= 9) ? "0" + date.getUTCFullYear() : date.getUTCFullYear().toString();
    const UTCMonth = ((date.getUTCMonth()+1) <= 9) ? "0" + (date.getUTCMonth()+1) :(date.getUTCMonth()+1).toString();
    const UTCDate = (date.getUTCDate() <= 9) ? "0" + date.getUTCDate() : date.getUTCDate().toString();
    const UTCHours = (date.getUTCHours() <= 9) ? "0" + date.getUTCHours() : date.getUTCHours().toString();
    const UTCMinutes = (date.getUTCMinutes() <= 9) ? "0" + date.getUTCMinutes() : date.getUTCMinutes().toString();
    const UTCSeconds = (date.getUTCSeconds() <= 9) ? "0" + date.getUTCSeconds() : date.getUTCSeconds().toString();

    const UTCFullDate = UTCYear + "-" + UTCMonth + "-" + UTCDate + "T" + UTCHours + ":" + UTCMinutes + ":" + UTCSeconds + "Z";

    console.error(UTCFullDate);

    return UTCFullDate;
  }

  getStartDate(){

    return this.datesForm.get('startDate').value;
  }

  getStartTime(){

    return this.datesForm.get('startTime').value;
  }

  getEndDate(){

    return this.datesForm.get('endDate').value;
  }

  getEndTime(){

    return this.datesForm.get('endTime').value;
  }


  /**
   * if endDate is greater than startDate, return true
   * else return false
   * 
   */
  checkDates() {

    const sDate = this.getStartDate();
    const sTime = this.getStartTime();
    const eDate = this.getEndDate();
    const eTime = this.getEndTime();

    if(eDate && sDate
             && eTime
             && sTime  
             && eDate >= sDate
             && eTime > sTime) 
      return true;
    else return false;
  }


 /**
   * Save the dates and go to the next form
   */
  onSetDates() {

    this.endDateInf = false;

    const dates: IDatesEvent = {

      startDate: this.getUTCFullDate(new Date(this.getStartDate()+'T'+this.getStartTime())),
      endDate: this.getUTCFullDate(new Date(this.getEndDate()+'T'+this.getEndTime()))
    };

    console.log(dates);

    // this.itemFormService.setFormWithStepState(StepState.DATES, dates);

    if(this.itemFormService.item instanceof EventItem) {

      this.itemFormService.item.dates = dates;
      this.itemFormService.nextForm();
    }
  }

  onRestoreDatesForm(value:IDatesEvent){

    this.datesForm.patchValue({startDate:value.startDate});
    this.datesForm.patchValue({endDate:value.endDate});
  }

  onBack()
  {
    this.itemFormService.onBackWithoutSave();
  }

}
