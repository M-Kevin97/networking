/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IconBoosterComponent } from './icon-booster.component';

describe('IconBoosterComponent', () => {
  let component: IconBoosterComponent;
  let fixture: ComponentFixture<IconBoosterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconBoosterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconBoosterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
