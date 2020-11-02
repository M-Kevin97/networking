/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SignupWithService } from './signup-with.service';

describe('Service: SignupWith', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SignupWithService]
    });
  });

  it('should ...', inject([SignupWithService], (service: SignupWithService) => {
    expect(service).toBeTruthy();
  }));
});
