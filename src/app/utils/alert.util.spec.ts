import { TestBed } from '@angular/core/testing';

import { AlertUtil } from './alert.util';

describe('AlertService', () => {
  let service: AlertUtil;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertUtil);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
