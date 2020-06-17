import { InstructorGuardService } from './guards/instructor/instructor-guard.service';
import { AdminGuardService } from './guards/admin/admin-guard.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponent } from './core.component';
import { AuthService } from './auth/auth.service';
import { AuthGuardService } from './guards/user/auth-guard.service';

@NgModule({

  providers: [
    AuthService,
    AuthGuardService,
    AdminGuardService,
    InstructorGuardService
  ],
  imports: [
    CommonModule
  ],
  declarations: [
    CoreComponent 
  ]
})
export class CoreModule { }
