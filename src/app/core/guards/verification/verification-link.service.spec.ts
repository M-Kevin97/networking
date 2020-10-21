/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { VerificationLinkService } from './verification-link.service';

describe('Service: VerificationLink', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VerificationLinkService]
    });
  });

  it('should ...', inject([VerificationLinkService], (service: VerificationLinkService) => {
    expect(service).toBeTruthy();
  }));
});
