import { RouteUrl } from 'src/app/core/router/route-url.enum';
import { ItemFormService } from './shared/services/item-form.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.css']
})
export class ItemFormComponent implements OnInit {

  constructor(private itemFormService:ItemFormService,
              private router:Router) {}

  ngOnInit() {}

  closeForm() {
    this.itemFormService.clearForm();
    this.router.navigate([RouteUrl.FEED]);
  }

}
