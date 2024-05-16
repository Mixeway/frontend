import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetVulnsTableComponent } from './asset-vulns-table.component';

describe('AssetVulnsTableComponent', () => {
  let component: AssetVulnsTableComponent;
  let fixture: ComponentFixture<AssetVulnsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetVulnsTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetVulnsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
