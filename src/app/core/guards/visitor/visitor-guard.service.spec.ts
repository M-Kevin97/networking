/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VisitorGuardService } from './visitor-guard.service';

describe('Service: VisitorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VisitorGuardService]
    });
  });

  it('should ...', inject([VisitorGuardService], (service: VisitorGuardService) => {
    expect(service).toBeTruthy();
  }));
});
