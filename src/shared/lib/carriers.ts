export type CarrierKey =
  | 'supership'
  | 'ghn'
  | 'viettel-post'
  | 'vietnam-post'
  | 'best'
  | 'jt'
  | 'spx'
  | 'green-sm'
  | 'grab';

export interface CarrierProfile {
  key: CarrierKey;
  name: string;
  logoSrc: string;
  logoClass: string;
  waybillExample?: string;
  facilityCode?: string;
  aliases: string[];
}

export const CARRIER_PROFILES: Record<CarrierKey, CarrierProfile> = {
  supership: {
    key: 'supership',
    name: 'SuperShip',
    logoSrc: '/carriers/supership.jpg',
    logoClass: 'supership',
    waybillExample: 'STGS983262LM.826941741',
    aliases: ['supership', 'super ship'],
  },
  ghn: {
    key: 'ghn',
    name: 'GHN',
    logoSrc: '/carriers/ghn.jpg',
    logoClass: 'ghn',
    waybillExample: 'GY8YLSDK',
    facilityCode: '100-A2-09-00',
    aliases: ['ghn', 'giao hàng nhanh', 'giao hang nhanh'],
  },
  'viettel-post': {
    key: 'viettel-post',
    name: 'Viettel Post',
    logoSrc: '/carriers/viettel_emblem.png',
    logoClass: 'viettelpost',
    waybillExample: 'SOO10902766013',
    aliases: ['viettel post', 'viettelpost', 'viettel', 'vtp'],
  },
  'vietnam-post': {
    key: 'vietnam-post',
    name: 'Vietnam Post',
    logoSrc: '/carriers/vnp.jpg',
    logoClass: 'vnpost',
    waybillExample: 'CC2199034123VN',
    aliases: ['vietnam post', 'vietnampost', 'vnpost', 'vnp'],
  },
  best: {
    key: 'best',
    name: 'BEST Express',
    logoSrc: '/carriers/BEST.jpg',
    logoClass: 'best',
    waybillExample: '999800060099891',
    facilityCode: 'OO012-00-003-02',
    aliases: ['best express', 'best'],
  },
  jt: {
    key: 'jt',
    name: 'J&T Express',
    logoSrc: '/carriers/jt_official.webp',
    logoClass: 'jt',
    waybillExample: '802808938571',
    facilityCode: '470-024C33-',
    aliases: ['j&t express', 'j&t', 'jnt', 'jt express'],
  },
  spx: {
    key: 'spx',
    name: 'SPX Express',
    logoSrc: '/carriers/spx_official.svg',
    logoClass: 'spx',
    waybillExample: 'SPXVN066263841279',
    facilityCode: 'HCA-51-172-Q5P8-N | Q5-P8-03',
    aliases: ['spx express', 'spx', 'shopee express', 'shopee'],
  },
  'green-sm': {
    key: 'green-sm',
    name: 'Green SM Express',
    logoSrc: '/carriers/xanhsm.jpg',
    logoClass: 'green-sm',
    waybillExample: 'GSM-EXP-20260920-000003',
    facilityCode: 'GSM-HCM-01',
    aliases: ['green sm express', 'green sm', 'greensm', 'xanh sm', 'xanhsm'],
  },
  grab: {
    key: 'grab',
    name: 'GrabExpress',
    logoSrc: '/carriers/grab.jpg',
    logoClass: 'grab',
    waybillExample: 'DELV-1708923451-A8B9C',
    facilityCode: 'GRAB-HCM-01',
    aliases: ['grabexpress', 'grab express', 'grab'],
  },
};

const MATCH_ORDER: CarrierKey[] = [
  'green-sm',
  'grab',
  'spx',
  'jt',
  'best',
  'ghn',
  'vietnam-post',
  'viettel-post',
  'supership',
];

function normalizeCarrierName(value: string): string {
  return value.trim().toLocaleLowerCase('vi-VN');
}

export function getCarrierProfile(carrier: string): CarrierProfile | undefined {
  const normalized = normalizeCarrierName(carrier);
  return MATCH_ORDER.map((key) => CARRIER_PROFILES[key]).find((profile) =>
    profile.aliases.some((alias) => normalized.includes(alias)),
  );
}

export function getCarrierFacilityCode(carrier: string): string | undefined {
  return getCarrierProfile(carrier)?.facilityCode;
}
