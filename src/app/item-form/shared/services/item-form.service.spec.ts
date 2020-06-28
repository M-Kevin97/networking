/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ItemFormService } from './item-form.service';

describe('Service: ItemForm', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemFormService]
    });
  });

  it('should ...', inject([ItemFormService], (service: ItemFormService) => {
    expect(service).toBeTruthy();
  }));
});
