import { AuthGuardService } from 'src/app/auth/services/auth-guard.service';
import { TestBed } from '@angular/core/testing';


describe('AuthGuardService', () => {
  let service: AuthGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
