/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NavTermsComponent } from './nav-terms.component';

describe('NavTermsComponent', () => {
  let component: NavTermsComponent;
  let fixture: ComponentFixture<NavTermsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavTermsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavTermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
