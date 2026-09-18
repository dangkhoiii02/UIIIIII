import { describe, expect, it } from 'vitest';
import { CARRIER_PROFILES, getCarrierFacilityCode, getCarrierProfile } from './carriers';

describe('carrier catalog', () => {
  it('keeps the provided carrier waybill examples verbatim', () => {
    expect(CARRIER_PROFILES.supership.waybillExample).toBe('STGS983262LM.826941741');
    expect(CARRIER_PROFILES.ghn.waybillExample).toBe('GY8YLSDK');
    expect(CARRIER_PROFILES['viettel-post'].waybillExample).toBe('SOO10902766013');
    expect(CARRIER_PROFILES['vietnam-post'].waybillExample).toBe('CC2199034123VN');
    expect(CARRIER_PROFILES.best.waybillExample).toBe('999800060099891');
    expect(CARRIER_PROFILES.jt.waybillExample).toBe('802808938571');
    expect(CARRIER_PROFILES.spx.waybillExample).toBe('SPXVN066263841279');
  });

  it('resolves aliases without confusing Vietnam Post and Viettel Post', () => {
    expect(getCarrierProfile('ViettelPost')?.key).toBe('viettel-post');
    expect(getCarrierProfile('Vietnam Post')?.key).toBe('vietnam-post');
    expect(getCarrierProfile('Vietnam Post')?.logoSrc).toBe('/carriers/vnp.jpg');
    expect(getCarrierProfile('BEST Express')?.logoSrc).toBe('/carriers/BEST.jpg');
    expect(getCarrierProfile('Giao Hàng Nhanh (GHN)')?.logoSrc).toBe('/carriers/ghn.jpg');
  });

  it('keeps the provided facility codes verbatim', () => {
    expect(getCarrierFacilityCode('SPX Express')).toBe('HCA-51-172-Q5P8-N | Q5-P8-03');
    expect(getCarrierFacilityCode('GHN')).toBe('100-A2-09-00');
    expect(getCarrierFacilityCode('BEST Express')).toBe('OO012-00-003-02');
    expect(getCarrierFacilityCode('J&T Express')).toBe('470-024C33-');
  });
});
