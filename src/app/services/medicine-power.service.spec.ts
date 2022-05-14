import { TestBed } from '@angular/core/testing';

import { MedicinePowerService } from './medicine-power.service';

describe('MedicinePowerService', () => {
  let service: MedicinePowerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicinePowerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
