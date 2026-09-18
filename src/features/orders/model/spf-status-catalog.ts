export type SpfStatusCode =
  | 'SPF-0101'
  | 'SPF-0102'
  | 'SPF-0201'
  | 'SPF-0202'
  | 'SPF-0301'
  | 'SPF-0401'
  | 'SPF-0402'
  | 'SPF-0403'
  | 'SPF-0501'
  | 'SPF-0502'
  | 'SPF-0601'
  | 'SPF-0602'
  | 'SPF-0603'
  | 'SPF-0604'
  | 'SPF-0605'
  | 'SPF-0606'
  | 'SPF-0701'
  | 'SPF-0702'
  | 'SPF-0801'
  | 'SPF-0802'
  | 'SPF-0803'
  | 'SPF-0901'
  | 'SPF-0902'
  | 'SPF-1001'
  | 'SPF-1002'
  | 'SPF-1003'
  | 'SPF-1004'
  | 'SPF-1005'
  | 'SPF-1006'
  | 'SPF-1007'
  | 'SPF-1008'
  | 'SPF-1009'
  | 'SPF-1101'
  | 'SPF-1102'
  | 'SPF-1103'
  | 'SPF-1104'
  | 'SPF-1105'
  | 'SPF-1106'
  | 'SPF-1107'
  | 'SPF-1108'
  | 'SPF-1201'
  | 'SPF-1202'
  | 'SPF-1203';

export type SpfStatusGroup =
  | 'Khởi tạo'
  | 'Hủy đơn'
  | 'Chờ lấy hàng'
  | 'Đang lấy hàng'
  | 'Đã lấy hàng'
  | 'Bàn giao'
  | 'Trung chuyển'
  | 'Đang giao hàng'
  | 'Đã giao hàng'
  | 'Chuyển hoàn'
  | 'Trả hàng'
  | 'Đã trả hàng';

export interface SpfStatusItem {
  stt: number;
  group: SpfStatusGroup;
  code: SpfStatusCode;
  name: string;
  description: string;
  docUrl?: string;
}

export const SPF_STATUS_CATALOG = [
  {
    stt: 1,
    group: 'Khởi tạo',
    code: 'SPF-0101',
    name: 'Đang tạo đơn NVC',
    description: 'SuperPlatform đang thực hiện yêu cầu tạo đơn/mã vận đơn tại NVC.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-IXhIdkXaCo57lfxliJ8ltwGvgod',
  },
  {
    stt: 2,
    group: 'Khởi tạo',
    code: 'SPF-0102',
    name: 'Tạo đơn NVC lỗi',
    description: 'Yêu cầu tạo đơn tại NVC chưa thành công và có thể cần retry hoặc xử lý tiếp.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-WAGvd4ypAovQ6uxLbeMlPRCfggf',
  },
  {
    stt: 3,
    group: 'Hủy đơn',
    code: 'SPF-0201',
    name: 'Đã hủy',
    description:
      'Đơn NVC đã được hủy thành công và không tiếp tục vận chuyển trên chặng tương ứng.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-AlKXdKAn5ohijAxbRPmlOd53gwe',
  },
  {
    stt: 4,
    group: 'Hủy đơn',
    code: 'SPF-0202',
    name: 'Hủy đơn NVC lỗi',
    description: 'Yêu cầu hủy đơn tại NVC chưa thành công và có thể cần retry.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-Am9kd1feAoYks6x4c0Mlnx8FgAt',
  },
  {
    stt: 5,
    group: 'Chờ lấy hàng',
    code: 'SPF-0301',
    name: 'Chờ lấy hàng',
    description: 'Đơn đã được tạo thành công và đang chờ NVC bắt đầu thực hiện lấy hàng.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-PIxudMNGaoT7zbxx0G9lbBoBgfb',
  },
  {
    stt: 6,
    group: 'Đang lấy hàng',
    code: 'SPF-0401',
    name: 'Đang lấy hàng',
    description: 'NVC lấy đang thực hiện quá trình lấy hàng từ Shop/điểm lấy.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-Jeh0d3M4AoRGqGxSNbEldXt9gHg',
  },
  {
    stt: 7,
    group: 'Đang lấy hàng',
    code: 'SPF-0402',
    name: 'Lấy hàng thất bại',
    description: 'Một lần lấy hàng của NVC chưa thành công.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-Tb8vdzaluof40yxUQMzl1knfgbc',
  },
  {
    stt: 8,
    group: 'Đang lấy hàng',
    code: 'SPF-0403',
    name: 'Đang yêu cầu lấy lại',
    description:
      'Shop yêu cầu CS yêu cầu NVC thực hiện lại việc lấy hàng sau khi lấy chưa thành công.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-EX5Mdoae1oM9uKxFHFjl1z1sggh',
  },
  {
    stt: 9,
    group: 'Đã lấy hàng',
    code: 'SPF-0501',
    name: 'Đã lấy hàng',
    description: 'NVC lấy đã nhận hàng thành công từ Shop/điểm lấy.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-OFJodY4N4ozJTGxuHwqlhocugNc',
  },
  {
    stt: 10,
    group: 'Đã lấy hàng',
    code: 'SPF-0502',
    name: 'Đã nhập kho/bưu cục lấy',
    description: 'Hàng đã được đưa vào kho/bưu cục đầu của NVC lấy sau khi lấy thành công.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-EODhdhGpWoKIJZxFEAVllqBMgWh',
  },
  {
    stt: 11,
    group: 'Bàn giao',
    code: 'SPF-0601',
    name: 'Chờ bàn giao',
    description: 'Hàng đang chờ được bàn giao từ NVC lấy sang NVC giao khi hai NVC khác nhau.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-BKZPdZ9fLoyBdqxEQSXluNbpgcb',
  },
  {
    stt: 12,
    group: 'Bàn giao',
    code: 'SPF-0602',
    name: 'NVC giao đang nhận hàng',
    description: 'NVC giao đang thực hiện quá trình tiếp nhận/ đang đi lấy hàng từ NVC lấy.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-JUJod51cwoN8j7xz1UWl90ajgng',
  },
  {
    stt: 13,
    group: 'Bàn giao',
    code: 'SPF-0603',
    name: 'Bàn giao thất bại',
    description:
      'Quá trình bàn giao từ NVC lấy sang NVC giao chưa thành công (NVC giao lấy hàng thất bại từ NVC lấy).',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-V8gpdpTuXoYoUFxxqr0l2ovfg7e',
  },
  {
    stt: 14,
    group: 'Bàn giao',
    code: 'SPF-0604',
    name: 'Đang yêu cầu bàn giao lại',
    description:
      'Đang có yêu cầu thực hiện lại việc bàn giao hàng sau khi bàn giao chưa thành công.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-UrpRdKC3mo5Wp7xiORilF9mHgWe',
  },
  {
    stt: 15,
    group: 'Bàn giao',
    code: 'SPF-0605',
    name: 'NVC giao đã nhận hàng',
    description: 'NVC giao đã nhận hàng thành công từ NVC lấy.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-Oq5advsBZoLModxofQVlZU81gcc',
  },
  {
    stt: 16,
    group: 'Bàn giao',
    code: 'SPF-0606',
    name: 'Đã nhập kho NVC giao',
    description: 'Hàng đã được nhập kho/bưu cục của NVC thực hiện chặng giao sau khi bàn giao.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-GToIdctTDoOHNtxaMtWlk2E0gKb',
  },
  {
    stt: 17,
    group: 'Trung chuyển',
    code: 'SPF-0701',
    name: 'Đang trung chuyển',
    description: 'Hàng đang được vận chuyển trong mạng lưới của NVC theo chiều giao.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-NGkbddwRioq2fNx9l6UllyC1gmD',
  },
  {
    stt: 18,
    group: 'Trung chuyển',
    code: 'SPF-0702',
    name: 'Đã đến kho/bưu cục giao',
    description: 'Hàng đã tới kho/bưu cục phục vụ cho chặng giao cuối đến người nhận.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-PvlhdXok2ocXaSxzoLclXrg9gOc',
  },
  {
    stt: 19,
    group: 'Đang giao hàng',
    code: 'SPF-0801',
    name: 'Đang giao hàng',
    description: 'NVC đang thực hiện giao hàng đến người nhận.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-ZeXqdif6DoEBjixcSv9lnIa6gMh',
  },
  {
    stt: 20,
    group: 'Đang giao hàng',
    code: 'SPF-0802',
    name: 'Giao hàng thất bại',
    description: 'Một lần giao hàng đến người nhận chưa thành công.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-T9TgdMGmioo6dIxiYnrlq34cg7g',
  },
  {
    stt: 21,
    group: 'Đang giao hàng',
    code: 'SPF-0803',
    name: 'Đang yêu cầu giao lại',
    description:
      'Đang có yêu cầu NVC thực hiện giao lại sau khi không còn lượt giao thông thường hoặc cần xử lý lại theo nghiệp vụ.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-DZTLdrcVTo6m7CxVtSylavVbgSc',
  },
  {
    stt: 22,
    group: 'Đã giao hàng',
    code: 'SPF-0901',
    name: 'Đã giao hàng',
    description: 'Toàn bộ phần hàng cần giao đã được giao thành công cho người nhận.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-Rk2HdjoLoo28Z6xqCeplkZBRg0f',
  },
  {
    stt: 23,
    group: 'Đã giao hàng',
    code: 'SPF-0902',
    name: 'Đã giao một phần',
    description:
      'Chỉ một phần hàng được giao thành công; phần còn lại tiếp tục được xử lý theo luồng trả/hoàn.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-B7M5dnLNWoQrOUxn98alqsrsgjg',
  },
  {
    stt: 24,
    group: 'Chuyển hoàn',
    code: 'SPF-1001',
    name: 'Chờ xác nhận chuyển hoàn',
    description: 'Đơn đã có yêu cầu chuyển hoàn từ CS nhưng đang chờ NVC xác nhận.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-Yss4dR1SsoU8fKxtsy9lQhdYgOq',
  },
  {
    stt: 25,
    group: 'Chuyển hoàn',
    code: 'SPF-1002',
    name: 'Đã xác nhận chuyển hoàn',
    description: 'NVC đã xác nhận đơn chuyển từ chiều giao sang chiều hoàn.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-EzYmdEwZJoMNVGxcdTrlJcchg5b',
  },
  {
    stt: 26,
    group: 'Chuyển hoàn',
    code: 'SPF-1003',
    name: 'Chờ lấy hàng hoàn',
    description: 'Luồng vận chuyển hoàn đang chờ NVC thực hiện lấy hàng cho chặng hoàn.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-DhwEdhvzro8jojxXqrYlWoYdgif',
  },
  {
    stt: 27,
    group: 'Chuyển hoàn',
    code: 'SPF-1004',
    name: 'Đang lấy hàng hoàn',
    description: 'NVC hoàn đang thực hiện lấy hàng để bắt đầu chặng vận chuyển hoàn.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-CIV4dBBujoXf8qxFU18llb0vgQh',
  },
  {
    stt: 28,
    group: 'Chuyển hoàn',
    code: 'SPF-1005',
    name: 'Lấy hàng hoàn thất bại',
    description: 'Một lần lấy hàng của chặng hoàn chưa thành công.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-LTA3dUr9Gomly0xyprblbfM1gGb',
  },
  {
    stt: 29,
    group: 'Chuyển hoàn',
    code: 'SPF-1006',
    name: 'Đang yêu cầu lấy lại hàng hoàn',
    description: 'Đang có yêu cầu NVC hoàn thực hiện lại việc lấy hàng hoàn.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-LwXrdsXT8owSAuxhZEYlskY2gFb',
  },
  {
    stt: 30,
    group: 'Chuyển hoàn',
    code: 'SPF-1007',
    name: 'Đã lấy hàng hoàn',
    description: 'NVC thực hiện chặng hoàn đã nhận hàng thành công.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-FU7Wd5Wc7onCA1xGKSoleHsegPb',
  },
  {
    stt: 31,
    group: 'Chuyển hoàn',
    code: 'SPF-1008',
    name: 'Đã nhập kho NVC hoàn',
    description: 'Hàng đã được đưa vào kho/bưu cục của NVC thực hiện chặng hoàn.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-OWYYd3XbLowXx0xi2zdlFodPgah',
  },
  {
    stt: 32,
    group: 'Chuyển hoàn',
    code: 'SPF-1009',
    name: 'Đang chuyển hoàn',
    description:
      'Hàng đang được vận chuyển theo chiều hoàn về điểm trả hoặc tới NVC thực hiện chặng hoàn tiếp theo.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-XrsmdV9WUoaqwdx5j3Zla08Hg8d',
  },
  {
    stt: 33,
    group: 'Trả hàng',
    code: 'SPF-1101',
    name: 'Đã đến kho trả trung gian',
    description: 'Hàng đã đến kho trả trung gian trong luồng vận chuyển hoàn.',
  },
  {
    stt: 34,
    group: 'Trả hàng',
    code: 'SPF-1102',
    name: 'Đang trả cho NVC hoàn cuối',
    description: 'NVC hiện tại đang thực hiện bàn giao hàng cho NVC đảm nhiệm chặng hoàn cuối.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-IOWQdkkp7otYSpx4G5nlcjCkgEb',
  },
  {
    stt: 35,
    group: 'Trả hàng',
    code: 'SPF-1103',
    name: 'Trả NVC hoàn cuối thất bại',
    description: 'Việc bàn giao hàng cho NVC hoàn cuối chưa thành công.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-PYe2dQEICoPnPmxuwTglLD80gNc',
  },
  {
    stt: 36,
    group: 'Trả hàng',
    code: 'SPF-1104',
    name: 'Đã trả cho NVC hoàn cuối',
    description: 'NVC hoàn cuối đã nhận hàng thành công từ NVC thực hiện chặng hoàn trước đó.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-Vrh9dZ2DfoMiafxuyy9laIXDgLe',
  },
  {
    stt: 37,
    group: 'Trả hàng',
    code: 'SPF-1105',
    name: 'Đã đến kho trả cuối',
    description: 'Hàng đã tới kho/điểm phục vụ cho quá trình trả tại điểm cuối.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-HActdCFhkoLKtyx0PxZlO1bNgle',
  },
  {
    stt: 38,
    group: 'Trả hàng',
    code: 'SPF-1106',
    name: 'Đang trả hàng',
    description: 'NVC đang thực hiện chặng trả hàng cuối đến Shop/điểm trả cuối.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-GyLEd5YMnoysOsxlVHhlOlFjg4p',
  },
  {
    stt: 39,
    group: 'Trả hàng',
    code: 'SPF-1107',
    name: 'Trả hàng thất bại',
    description: 'Một lần trả hàng tại điểm trả cuối chưa thành công.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-BCCGdUbsUoWAEOxz147l3clqgdf',
  },
  {
    stt: 40,
    group: 'Trả hàng',
    code: 'SPF-1108',
    name: 'Đang yêu cầu trả lại',
    description:
      'Đang có yêu cầu NVC thực hiện lại việc trả hàng sau khi không còn lượt trả thông thường hoặc cần xử lý lại.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-RMNldKCyQoqX3Kx6ekClEWP0gLf',
  },
  {
    stt: 41,
    group: 'Đã trả hàng',
    code: 'SPF-1201',
    name: 'Đã trả hàng',
    description:
      'Hàng của nghiệp vụ chuyển hoàn do giao thất bại đã được trả thành công về điểm trả cuối.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-LoR1d1zA7oi8v7xl5P5l4qAhgNb',
  },
  {
    stt: 42,
    group: 'Đã trả hàng',
    code: 'SPF-1202',
    name: 'Đổi trả thành công',
    description:
      'Luồng trả hàng của nghiệp vụ đổi trả đã hoàn tất theo điều kiện nghiệp vụ được quy định.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-F7w3dIpyfoQYV0xM3U8lU2uug2V',
  },
  {
    stt: 43,
    group: 'Đã trả hàng',
    code: 'SPF-1203',
    name: 'Đã trả một phần',
    description: 'Phần hàng còn lại của đơn giao một phần đã được trả thành công về điểm trả cuối.',
    docUrl:
      'https://supertek.sg.larksuite.com/docx/NFzAdToProuStUxLCM4lwCxxg0d#share-Wm7Ydx12fouswaxJxEplnuLXgQe',
  },
] as const satisfies readonly SpfStatusItem[];

export type SpfStatusName = (typeof SPF_STATUS_CATALOG)[number]['name'];

// O(1) Quick Map by SPF Code
export const SPF_STATUS_MAP: Record<SpfStatusCode, SpfStatusItem> = SPF_STATUS_CATALOG.reduce(
  (acc, item) => {
    acc[item.code] = item;
    return acc;
  },
  {} as Record<SpfStatusCode, SpfStatusItem>,
);

// Helper Lookup Utilities
export function getSpfStatusByCode(code: string): SpfStatusItem | undefined {
  return SPF_STATUS_MAP[code as SpfStatusCode];
}

export function getSpfStatusesByGroup(group: SpfStatusGroup): SpfStatusItem[] {
  return SPF_STATUS_CATALOG.filter((item) => item.group === group);
}

export const SPF_STATUS_NAME_MAP = SPF_STATUS_CATALOG.reduce(
  (acc, item) => {
    acc[item.name] = item;
    return acc;
  },
  {} as Record<SpfStatusName, SpfStatusItem>,
);

export function getSpfStatusByName(name: string): SpfStatusItem | undefined {
  return SPF_STATUS_NAME_MAP[name as SpfStatusName];
}

export type SpfLifecyclePhase =
  | 'creating'
  | 'cancelled'
  | 'pickup'
  | 'handover'
  | 'delivery'
  | 'delivered'
  | 'return'
  | 'returned';

/**
 * Nhóm vòng đời dùng cho lọc và trình bày UI. Mã SPF vẫn là nguồn sự thật;
 * không suy diễn nghiệp vụ từ chuỗi nhãn của nhà vận chuyển.
 */
export function getSpfLifecyclePhase(code: SpfStatusCode): SpfLifecyclePhase {
  const family = code.slice(4, 6);
  if (family === '01') return 'creating';
  if (family === '02') return 'cancelled';
  if (['03', '04', '05'].includes(family)) return 'pickup';
  if (family === '06') return 'handover';
  if (['07', '08'].includes(family)) return 'delivery';
  if (family === '09') return 'delivered';
  if (['10', '11'].includes(family)) return 'return';
  return 'returned';
}

export function isSpfFailureStatus(code: SpfStatusCode): boolean {
  return [
    'SPF-0102',
    'SPF-0202',
    'SPF-0402',
    'SPF-0603',
    'SPF-0802',
    'SPF-1005',
    'SPF-1103',
    'SPF-1107',
  ].includes(code);
}

/** Nhãn công khai rút gọn đúng theo mục 9.2 của tài liệu trạng thái. */
export function getPublicSpfStatusName(code: SpfStatusCode): string {
  if (code >= 'SPF-0601' && code <= 'SPF-0606') return 'Đang trung chuyển';
  if (code >= 'SPF-1101' && code <= 'SPF-1104') return 'Đang chuyển hoàn';
  return SPF_STATUS_MAP[code].name;
}
