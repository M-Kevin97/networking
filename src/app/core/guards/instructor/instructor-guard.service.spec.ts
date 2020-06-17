/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InstructorGuardService } from './instructor-guard.service';

describe('Service: InstructorGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InstructorGuardService]
    });
  });

  it('should ...', inject([InstructorGuardService], (service: InstructorGuardService) => {
    expect(service).toBeTruthy();
  }));
});
