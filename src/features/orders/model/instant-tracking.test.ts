import { describe, expect, it } from 'vitest';
import {
  canViewInstantDriverJourney,
  formatInstantDistance,
  formatInstantEta,
} from './instant-tracking';

describe('instant driver journey visibility', () => {
  it('hides live tracking before the driver has picked up the parcel', () => {
    expect(canViewInstantDriverJourney(undefined)).toBe(false);
    expect(canViewInstantDriverJourney({ state: 'CREATED' })).toBe(false);
    expect(canViewInstantDriverJourney({ state: 'DRIVER_NOT_FOUND' })).toBe(false);
    expect(canViewInstantDriverJourney({ state: 'DRIVER_ASSIGNED' })).toBe(false);
    expect(canViewInstantDriverJourney({ state: 'DRIVER_TO_PICKUP' })).toBe(false);
  });

  it('shows live tracking once the driver has picked up the parcel', () => {
    expect(canViewInstantDriverJourney({ state: 'PICKED_UP' })).toBe(true);
    expect(canViewInstantDriverJourney({ state: 'IN_DELIVERY' })).toBe(true);
    expect(canViewInstantDriverJourney({ state: 'ARRIVING' })).toBe(true);
    expect(canViewInstantDriverJourney({ state: 'DELIVERED' })).toBe(true);
  });

  it('leaves missing ETA and distance empty instead of rendering undefined', () => {
    expect(formatInstantEta(undefined)).toBe('');
    expect(formatInstantEta(Number.NaN)).toBe('');
    expect(formatInstantEta(15)).toBe('15 phút');
    expect(formatInstantDistance(undefined)).toBe('');
    expect(formatInstantDistance(2.5)).toBe('2.5 km');
  });
});
