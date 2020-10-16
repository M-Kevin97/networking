/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { NewElementComponent } from './new-element.component';

describe('NewElementComponent', () => {
  let component: NewElementComponent;
  let fixture: ComponentFixture<NewElementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewElementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
