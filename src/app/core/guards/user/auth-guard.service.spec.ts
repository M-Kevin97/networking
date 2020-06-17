import { AuthGuardService } from 'src/app/core/guards/user/auth-guard.service';
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
