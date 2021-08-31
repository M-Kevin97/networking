import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SharedModule } from '../shared/shared.module';
import { RouterModule } from '@angular/router';
import { SettingsRoutes } from './settings.routing';
import { ProfileSettingComponent } from './pages/profile-setting/profile-setting.component';

@NgModule({
  imports: [
    SharedModule,
    RouterModule,
    SettingsRoutes,
  ],
  declarations: [
    SettingsComponent,
    ProfileSettingComponent
  ]
})
export class SettingsModule { }
