/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { SearchBar2Component } from './search-bar2.component';

describe('SearchBar2Component', () => {
  let component: SearchBar2Component;
  let fixture: ComponentFixture<SearchBar2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBar2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBar2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
