import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { AuthicatedGuard } from './authicated.guard';

describe('authicatedGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => AuthicatedGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
