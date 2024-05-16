import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowAssetComponent } from './show-asset.component';

describe('ShowAssetComponent', () => {
  let component: ShowAssetComponent;
  let fixture: ComponentFixture<ShowAssetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShowAssetComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShowAssetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
