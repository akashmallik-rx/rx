import { TestBed } from '@angular/core/testing';

import { NotificationUtil } from './notification.util';

describe('NotificationService', () => {
  let service: NotificationUtil;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationUtil);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
