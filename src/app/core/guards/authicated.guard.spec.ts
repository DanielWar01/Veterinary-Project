import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authicatedGuard } from './authicated.guard';

describe('authicatedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authicatedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
