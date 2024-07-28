import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetNameTableComponent } from './asset-name-table.component';

describe('AssetNameTableComponent', () => {
  let component: AssetNameTableComponent;
  let fixture: ComponentFixture<AssetNameTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetNameTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetNameTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
