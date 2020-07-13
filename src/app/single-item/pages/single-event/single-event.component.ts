import { Component, OnInit } from '@angular/core';
import { EventItem } from 'src/app/shared/item/event-item';
import { ActivatedRoute, Router } from '@angular/router';
import { ItemService } from 'src/app/shared/item/item.service';

@Component({
  selector: 'app-single-event',
  templateUrl: './single-event.component.html',
  styleUrls: ['./single-event.component.css']
})
export class SingleEventComponent implements OnInit {

  event:EventItem;

  constructor(private route:ActivatedRoute,
              private itemService:ItemService,
              private router:Router) { }
  

  ngOnInit() {
    this.event = new EventItem(null,null,null,null,null,null,null,null,null,null,null);

    const id = this.route.snapshot.params['id'];
    this.itemService.getSingleEventFromDBWithId(id).then(
      (event:EventItem) => {
        this.event = EventItem.eventFromJson(event);
        this.event.id = id;
        console.log(this.event);
        console.log(event['authors']);
        console.log(this.event.authors);
      }
    );
  }

  onBack(){
    this.router.navigate(['/items']);
  }

}
