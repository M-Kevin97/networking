/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EditCourseContentComponent } from './edit-course-content.component';

describe('EditCourseContentComponent', () => {
  let component: EditCourseContentComponent;
  let fixture: ComponentFixture<EditCourseContentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditCourseContentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCourseContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
