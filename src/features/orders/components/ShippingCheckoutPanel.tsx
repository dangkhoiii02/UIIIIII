import { useEffect, useMemo, useState } from 'react';
import {
  Bike,
  Bot,
  Check,
  Info,
  MapPin,
  RefreshCw,
  ShieldCheck,
  Truck,
  WalletCards,
  X,
  Zap,
} from 'lucide-react';
import { money } from '@/shared/lib/format';
import { Button } from '@/shared/ui/Button';
import { CustomSelect } from '@/shared/ui/CustomSelect';
import { Modal } from '@/shared/ui/Modal';
import { usePickup } from '@/features/pickup';
import type { OrderInput } from '../model/types';
import { billableWeight } from '../model/order';

export type CustomerApplication = 'supership' | 'superai';
type DeliveryMode = 'standard' | 'instant';
type SelectionMode =
  'ai-best' | 'default' | 'ai-multi' | 'cheapest' | 'fastest' | 'default-fallback';

interface DeliveryOption {
  id: string;
  carrier: string;
  service: string;
  kind: 'standard' | 'instant';
  price: number;
  eta: string;
  pickupEta?: string;
  vehicle?: string;
  cod: string;
  badge?: string;
  badgeTone?: 'green' | 'blue' | 'amber';
  quoteTtl?: string;
  score: number;
  rating: number;
}

const STANDARD_OPTIONS: DeliveryOption[] = [
  {
    id: 'spx-standard',
    carrier: 'SPX Express',
    service: 'Giao hàng tiêu chuẩn',
    kind: 'standard',
    price: 14000,
    eta: '0.9 - 1.4 ngày',
    cod: 'Có hỗ trợ',
    badge: 'Hiệu quả nhất',
    badgeTone: 'green',
    score: 98.12,
    rating: 4,
  },
  {
    id: 'ghn-standard',
    carrier: 'GHN',
    service: 'Tiêu chuẩn',
    kind: 'standard',
    price: 18000,
    eta: '0.5 - 1.0 ngày',
    cod: 'Có hỗ trợ',
    badge: 'Quá tải',
    score: 90.72,
    rating: 3,
  },
  {
    id: 'jt-standard',
    carrier: 'J&T Express',
    service: 'Giao hàng tiêu chuẩn',
    kind: 'standard',
    price: 18000,
    eta: '0.4 - 0.9 ngày',
    cod: 'Có hỗ trợ',
    badge: 'Ổn định',
    badgeTone: 'amber',
    score: 92.43,
    rating: 4,
  },
  {
    id: 'viettel-standard',
    carrier: 'Viettel Post',
    service: 'Chuyển phát tiêu chuẩn',
    kind: 'standard',
    price: 18000,
    eta: '0.4 - 0.9 ngày',
    cod: 'Có hỗ trợ',
    badge: 'Dịch vụ tốt',
    badgeTone: 'green',
    score: 91.71,
    rating: 4,
  },
  {
    id: 'best-standard',
    carrier: 'BEST Express',
    service: 'Giao hàng tiêu chuẩn',
    kind: 'standard',
    price: 18000,
    eta: '0.8 - 1.3 ngày',
    cod: 'Có hỗ trợ',
    score: 93.14,
    rating: 4,
  },
  {
    id: 'vnpost-standard',
    carrier: 'Vietnam Post',
    service: 'Chuyển phát tiêu chuẩn',
    kind: 'standard',
    price: 18000,
    eta: '0.6 - 1.1 ngày',
    cod: 'Có hỗ trợ',
    score: 91.86,
    rating: 4,
  },
];

const INSTANT_OPTIONS: DeliveryOption[] = [
  {
    id: 'green-sm-bike',
    carrier: 'Green SM Express',
    service: 'Giao ngay bằng xe máy',
    kind: 'instant',
    price: 32000,
    eta: 'Giao dự kiến 35–45 phút',
    pickupEta: 'Tới lấy trong 10–15 phút',
    vehicle: 'Xe máy',
    cod: 'Theo quyền của tài khoản',
    badge: 'AI đề xuất',
    badgeTone: 'green',
    quoteTtl: '02:15',
    score: 98,
    rating: 5,
  },
  {
    id: 'grab-bike',
    carrier: 'GrabExpress',
    service: 'Giao ngay bằng xe máy',
    kind: 'instant',
    price: 35000,
    eta: 'Giao dự kiến 30–40 phút',
    pickupEta: 'Tới lấy trong 8–12 phút',
    vehicle: 'Xe máy',
    cod: 'Theo quyền của tài khoản',
    badge: 'Nhanh nhất',
    badgeTone: 'blue',
    quoteTtl: '01:48',
    score: 96,
    rating: 4,
  },
];

const AI_MODES: Array<{ value: SelectionMode; title: string; description: string }> = [
  {
    value: 'ai-best',
    title: 'AI chọn một phương án hiệu quả nhất',
    description: 'Cân bằng giá, thời gian giao và khả năng tìm được tài xế.',
  },
  {
    value: 'default',
    title: 'Một nhà vận chuyển mặc định',
    description: 'Luôn ưu tiên đúng nhà vận chuyển Shop đã cấu hình.',
  },
  {
    value: 'ai-multi',
    title: 'AI xếp hạng nhiều phương án',
    description: 'Shop xem và xác nhận trước khi tạo chuyến.',
  },
  {
    value: 'cheapest',
    title: 'Ưu tiên chi phí thấp nhất',
    description: 'Chọn giá bán thấp nhất trong các báo giá còn hiệu lực.',
  },
  {
    value: 'fastest',
    title: 'Ưu tiên giao nhanh nhất',
    description: 'Chọn ETA ngắn nhất trong các dịch vụ đang khả dụng.',
  },
  {
    value: 'default-fallback',
    title: 'NVC mặc định và phương án dự phòng',
    description: 'Chỉ chuyển phương án sau khi chuyến cũ đã kết thúc an toàn.',
  },
];

function CarrierMark({ carrier }: { carrier: string }) {
  if (carrier === 'Green SM Express') {
    return (
      <span className="carrier-option-brand green-sm">
        <img src="/carriers/xanhsm.jpg" alt="Green SM Express" />
      </span>
    );
  }
  if (carrier === 'GrabExpress') {
    return (
      <span className="carrier-option-brand grab">
        <img src="/carriers/grab.jpg" alt="GrabExpress" />
      </span>
    );
  }
  if (carrier === 'GHN') {
    return (
      <span className="carrier-option-brand ghn">
        <img src="/carriers/ghn.jpg" alt="GHN" />
      </span>
    );
  }
  if (carrier === 'Viettel Post') {
    return (
      <span className="carrier-option-brand viettelpost">
        <img src="/carriers/viettel_emblem.png" alt="Viettel Post" />
      </span>
    );
  }
  if (carrier === 'SPX Express') {
    return (
      <span className="carrier-option-brand spx">
        <img src="/carriers/spx_official.svg" alt="SPX Express" />
      </span>
    );
  }
  if (carrier === 'J&T Express') {
    return (
      <span className="carrier-option-brand jt">
        <img src="/carriers/jt_official.webp" alt="J&amp;T Express" />
      </span>
    );
  }
  if (carrier === 'BEST Express') {
    return (
      <span className="carrier-option-brand best">
        <img src="/carriers/BEST.jpg" alt="BEST Express" />
      </span>
    );
  }
  if (carrier === 'Vietnam Post') {
    return (
      <span className="carrier-option-brand vnpost">
        <img src="/carriers/vnp.jpg" alt="Vietnam Post" />
      </span>
    );
  }
  return (
    <span className="carrier-option-brand supership">
      <img src="/carriers/supership.jpg" alt="SuperShip" />
    </span>
  );
}

function DeliveryOptionCard({
  option,
  selected,
  disabled,
  readOnly,
  onSelect,
}: {
  option: DeliveryOption;
  selected: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={`delivery-option-card ${option.kind} ${selected ? 'selected' : ''} ${readOnly ? 'read-only' : ''}`}
      disabled={disabled}
      onClick={() => !readOnly && onSelect()}
      aria-disabled={readOnly}
      aria-pressed={selected}
    >
      <CarrierMark carrier={option.carrier} />
      <span className="delivery-option-content">
        <span className="delivery-option-title-line">
          <strong>{option.carrier}</strong>
          {option.badge && (
            <span className={`delivery-option-badge ${option.badgeTone || ''}`}>
              {option.badge}
            </span>
          )}
        </span>
        <span className="delivery-option-service">
          {option.vehicle ? `${option.vehicle} · ` : ''}
          {option.service}
        </span>
        <span className="delivery-option-success-rate">
          Tỷ lệ: <strong>{option.score}%</strong>
        </span>
        <span
          className="delivery-option-rating"
          aria-label={`Đánh giá ${option.rating} trên 5 sao`}
        >
          {Array.from({ length: 5 }, (_, index) => (
            <span key={index} className={index < option.rating ? 'filled' : ''}>
              ★
            </span>
          ))}
        </span>
        {option.kind === 'standard' && (
          <span className="delivery-option-eta">
            Dự kiến giao: <strong>{option.eta}</strong>
          </span>
        )}
      </span>
      <span className="delivery-option-price">
        <strong>{money(option.price)}</strong>
        {option.kind === 'instant' && (
          <small>
            <Bike size={11} /> {option.vehicle}
          </small>
        )}
      </span>
      {option.kind === 'instant' && (
        <span className="instant-delivery-times">
          <span>
            Nhận hàng<strong>{option.pickupEta?.replace('Tới lấy trong ', '~')}</strong>
          </span>
          <span>
            Giao tới<strong>{option.eta.replace('Giao dự kiến ', '~')}</strong>
          </span>
        </span>
      )}
    </button>
  );
}

export function ShippingCheckoutPanel({
  value,
  onChange,
  agreed,
  setAgreed,
  valid,
  editing,
  customerApplication,
}: {
  value: OrderInput;
  onChange: (patch: Partial<OrderInput>) => void;
  agreed: boolean;
  setAgreed: (value: boolean) => void;
  valid: boolean;
  editing: boolean;
  customerApplication: CustomerApplication;
}) {
  const [selectionMode, setSelectionMode] = useState<SelectionMode>(() => {
    const saved = localStorage.getItem('superplatform:carrier-selection-mode');
    return (saved as SelectionMode) || 'ai-best';
  });
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>('standard');
  const [selectedOptionId, setSelectedOptionId] = useState('spx-standard');
  const [showConfig, setShowConfig] = useState(false);
  const [defaultCarrier, setDefaultCarrier] = useState('green-sm-bike');
  const [grabOverrideEnabled, setGrabOverrideEnabled] = useState(false);
  const [greenOverrideEnabled, setGreenOverrideEnabled] = useState(false);
  const [grabPickupAddress, setGrabPickupAddress] = useState('');
  const [greenPickupAddress, setGreenPickupAddress] = useState('');

  const isSuperAi = customerApplication === 'superai';
  const { address: pickupAddress } = usePickup();
  const readyForQuote = Boolean(
    value.name.trim() &&
    value.phone.trim() &&
    value.address.trim() &&
    value.region.trim() &&
    value.product.trim() &&
    value.weight > 0,
  );
  const detectArea = (text: string) => {
    const normalized = text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .toLocaleLowerCase('vi')
      .replace(/tphcm/g, 'ho chi minh');
    const parts = normalized
      .split(/\s*[,/·•]\s*/)
      .map((part) => part.trim())
      .filter(Boolean);
    const administrativeArea = [...parts]
      .reverse()
      .find((part) => /^(thanh pho|tp\.?|tinh)\s+/.test(part));
    const fallback = parts.at(-1) || '';
    return (administrativeArea || fallback)
      .replace(/^(thanh pho|tp\.?|tinh)\s+/, '')
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');
  };
  const pickupCity = detectArea(pickupAddress);
  const recipientCity = detectArea(value.region);
  const isInnerCityEligible = Boolean(
    readyForQuote && pickupCity && recipientCity && pickupCity === recipientCity,
  );

  const availableOptions = useMemo(
    () => [...STANDARD_OPTIONS, ...(isInnerCityEligible ? INSTANT_OPTIONS : [])],
    [isInnerCityEligible],
  );
  const selectedOption =
    availableOptions.find((option) => option.id === selectedOptionId) || availableOptions[0];
  const effectiveDeliveryMode: DeliveryMode = isInnerCityEligible ? deliveryMode : 'standard';
  const activeSelectedOption =
    selectedOption?.kind === effectiveDeliveryMode ? selectedOption : undefined;
  const shippingFee = readyForQuote ? activeSelectedOption?.price || 0 : 0;

  useEffect(() => {
    if (!availableOptions.some((option) => option.id === selectedOptionId)) {
      setSelectedOptionId(availableOptions[0]!.id);
    }
  }, [availableOptions, selectedOptionId]);

  useEffect(() => {
    if (!isInnerCityEligible && deliveryMode !== 'standard') {
      setDeliveryMode('standard');
      setSelectedOptionId(STANDARD_OPTIONS[0]!.id);
    }
  }, [deliveryMode, isInnerCityEligible]);

  useEffect(() => {
    localStorage.setItem('superplatform:carrier-selection-mode', selectionMode);
  }, [selectionMode]);

  useEffect(() => {
    onChange({
      customerApplication: isSuperAi ? 'SUPERAI' : 'SUPERSHIP',
      customerModel: isSuperAi ? 'SUPERAI' : 'LOCAL_NEW',
      fulfillmentPlan: isSuperAi ? 'DIRECT_CARRIER' : 'LOCAL_PARTNER',
      selectedCarrier: selectedOption?.carrier,
      selectedService: selectedOption?.service,
      shippingFee,
      carrierSelectionMode: selectionMode,
      pickupAddressOverride:
        selectedOption?.id === 'grab-bike' && grabOverrideEnabled
          ? grabPickupAddress
          : selectedOption?.id === 'green-sm-bike' && greenOverrideEnabled
            ? greenPickupAddress
            : '',
    });
  }, [
    grabOverrideEnabled,
    grabPickupAddress,
    greenOverrideEnabled,
    greenPickupAddress,
    isSuperAi,
    onChange,
    selectedOption?.carrier,
    selectedOption?.id,
    selectedOption?.service,
    selectionMode,
    shippingFee,
  ]);

  const selectOption = (option: DeliveryOption) => {
    setSelectedOptionId(option.id);
    onChange({ selectedCarrier: option.carrier, selectedService: option.service });
  };

  const selectDeliveryMode = (mode: DeliveryMode) => {
    setDeliveryMode(mode);
    if (mode === 'standard' && selectedOption?.kind !== 'standard') {
      selectOption(STANDARD_OPTIONS[0]!);
    }
    if (mode === 'instant' && isInnerCityEligible && selectedOption?.kind !== 'instant') {
      selectOption(INSTANT_OPTIONS[0]!);
    }
  };

  const applyConfiguration = () => {
    if (selectionMode === 'default' || selectionMode === 'default-fallback') {
      setSelectedOptionId(defaultCarrier);
      setDeliveryMode(defaultCarrier.includes('bike') ? 'instant' : 'standard');
    } else if (selectionMode === 'cheapest') {
      setSelectedOptionId('spx-standard');
      setDeliveryMode('standard');
    } else if (selectionMode === 'fastest') {
      setSelectedOptionId(isInnerCityEligible ? 'grab-bike' : 'spx-standard');
      setDeliveryMode(isInnerCityEligible ? 'instant' : 'standard');
    } else if (selectionMode === 'ai-best') {
      setSelectedOptionId('spx-standard');
      setDeliveryMode('standard');
    }
    setShowConfig(false);
  };

  return (
    <div className="create-shipping-panel">
      <section className={`shipping-method-card ${!readyForQuote ? 'compact' : ''}`}>
        <div className="shipping-checkout-title">
          <WalletCards size={19} />
          <h2>Phí và tiền thu hộ</h2>
        </div>

        <div className="shipping-payment-choice">
          <strong>Phương án trả phí</strong>
          <div>
            <label>
              <input
                type="radio"
                name="payer"
                checked={value.payer === 'sender'}
                onChange={() => onChange({ payer: 'sender' })}
              />
              Cấn trừ COD
            </label>
            <label>
              <input
                type="radio"
                name="payer"
                checked={value.payer === 'recipient'}
                onChange={() => onChange({ payer: 'recipient' })}
              />
              Người nhận trả phí
              <Info size={13} />
            </label>
          </div>
        </div>

        <div className="shipping-method-label-row">
          <strong>Phương thức vận chuyển</strong>
          <button type="button" onClick={() => setShowConfig(true)}>
            Thay đổi
          </button>
        </div>
        {!readyForQuote ? (
          <p className="shipping-method-description">
            {isSuperAi ? (
              'Bạn chủ động chọn nhà vận chuyển phù hợp'
            ) : (
              <>
                Nhà vận chuyển bất kỳ theo <strong>phân tích AI (hiệu quả nhất)</strong>
              </>
            )}
          </p>
        ) : (
          <>
            {isInnerCityEligible && (
              <div
                className="shipping-service-tabs"
                role="tablist"
                aria-label="Loại hình vận chuyển"
              >
                <button
                  type="button"
                  className={deliveryMode === 'standard' ? 'active' : ''}
                  onClick={() => selectDeliveryMode('standard')}
                >
                  <Truck size={15} /> Tiêu chuẩn
                </button>
                <button
                  type="button"
                  className={deliveryMode === 'instant' ? 'active' : ''}
                  onClick={() => selectDeliveryMode('instant')}
                >
                  <Zap size={15} /> Giao ngay
                </button>
              </div>
            )}

            {effectiveDeliveryMode === 'standard' ? (
              <p className="shipping-method-description">
                {isSuperAi ? (
                  'Bạn chủ động chọn nhà vận chuyển phù hợp'
                ) : (
                  <>
                    Nhà vận chuyển bất kỳ theo <strong>phân tích AI (hiệu quả nhất)</strong>
                  </>
                )}
              </p>
            ) : (
              <div className="instant-service-note">
                <Zap size={15} /> Giao nhanh nội thành trong ngày qua đối tác gọi xe.
              </div>
            )}

            <div className="delivery-options-groups">
              {effectiveDeliveryMode === 'standard' ? (
                <div className="delivery-option-group">
                  <div className="carrier-list-label">
                    {isSuperAi ? 'Phương án đã chọn' : 'Gợi ý'}
                  </div>
                  {STANDARD_OPTIONS.filter(
                    (option) => option.id === (activeSelectedOption?.id || STANDARD_OPTIONS[0]!.id),
                  ).map((option) => (
                    <DeliveryOptionCard
                      key={option.id}
                      option={option}
                      selected
                      readOnly={!isSuperAi}
                      onSelect={() => selectOption(option)}
                    />
                  ))}
                  <div className="carrier-list-label reference">Tham khảo</div>
                  {STANDARD_OPTIONS.filter(
                    (option) => option.id !== (activeSelectedOption?.id || STANDARD_OPTIONS[0]!.id),
                  ).map((option) => (
                    <DeliveryOptionCard
                      key={option.id}
                      option={option}
                      selected={false}
                      readOnly={!isSuperAi}
                      onSelect={() => selectOption(option)}
                    />
                  ))}
                </div>
              ) : (
                <div className="delivery-option-group instant">
                  <div className="delivery-option-group-title">
                    <span>Giao ngay</span>
                  </div>
                  {isInnerCityEligible ? (
                    INSTANT_OPTIONS.map((option) => (
                      <DeliveryOptionCard
                        key={option.id}
                        option={option}
                        selected={activeSelectedOption?.id === option.id}
                        readOnly={!isSuperAi}
                        onSelect={() => selectOption(option)}
                      />
                    ))
                  ) : (
                    <div className="inner-city-unavailable">
                      <MapPin size={16} />
                      <span>
                        GrabExpress và Green SM chỉ khả dụng khi điểm lấy và người nhận cùng thành
                        phố, đồng thời nhà vận chuyển trả báo giá hợp lệ.
                      </span>
                    </div>
                  )}
                  {isInnerCityEligible && (
                    <div className="instant-price-refresh">
                      <span>
                        <Check size={12} /> Giá vừa được cập nhật
                      </span>
                      <button type="button">
                        <RefreshCw size={12} /> Làm mới giá
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )}

        <div className="shipping-extra-service">
          <strong>Dịch vụ thêm</strong>
          <label>
            <input
              type="checkbox"
              checked={value.returnGoods}
              onChange={(event) => onChange({ returnGoods: event.target.checked })}
            />
            Đổi / Lấy hàng về
            <Info size={13} />
          </label>
        </div>

        {readyForQuote && (
          <>
            <div className="shipping-fee-breakdown">
              <div className="fee-row">
                <span>
                  Trị giá hàng <Info size={12} />
                </span>
                <b>{money(value.value || 0)}</b>
              </div>
              <div className="fee-row">
                <span>
                  Khối lượng <Info size={12} />
                </span>
                <b>{billableWeight(value) || 0} gr</b>
              </div>
              <div className="fee-row">
                <span>
                  Phí giao hàng ({value.payer === 'sender' ? 'Cấn trừ COD' : 'Người nhận trả'})
                </span>
                <b>{money(shippingFee)}</b>
              </div>
              <div className="fee-row">
                <span>Phí bảo hiểm</span>
                <b>{money(0)}</b>
              </div>
              <div className="fee-row">
                <span>Phí trả hàng</span>
                <b>{money(0)}</b>
              </div>
              <div className="fee-row">
                <span>Phí hàng đổi</span>
                <b>{money(0)}</b>
              </div>
              <div className="fee-row">
                <span>Phí đổi địa chỉ</span>
                <b>{money(0)}</b>
              </div>
              <div className="fee-row">
                <span>Phí thu hộ</span>
                <b>{money(0)}</b>
              </div>
              <div className="fee-row total">
                <span>
                  Tổng phí vận chuyển <Info size={12} />
                </span>
                <b className="green">{money(shippingFee)}</b>
              </div>
              <div className="fee-row">
                <span>Tiền thu hộ</span>
                <b>{money(value.cod || 0)}</b>
              </div>
              <div className="fee-row">
                <span>Tiền thu người nhận</span>
                <b className="red">
                  {money(
                    value.payer === 'sender' ? value.cod || 0 : (value.cod || 0) + shippingFee,
                  )}
                </b>
              </div>
            </div>

            <div className="shipping-submit-area">
              <label className="create-terms-choice">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(event) => setAgreed(event.target.checked)}
                />
                <span>
                  Tôi đã đọc và đồng ý với <b>Điều khoản &amp; quy định</b>
                </span>
              </label>
              <Button
                type="submit"
                className="wide create-order-submit"
                variant="primary"
                disabled={!valid || !agreed || !activeSelectedOption}
              >
                {editing ? 'Lưu thay đổi' : 'Tạo đơn'}
              </Button>
            </div>
          </>
        )}
      </section>

      {showConfig && (
        <Modal
          title="Cấu hình nhà vận chuyển"
          wide
          onClose={() => setShowConfig(false)}
          footer={
            <>
              <Button onClick={() => setShowConfig(false)}>Đóng</Button>
              <Button variant="primary" onClick={applyConfiguration}>
                Xác nhận cấu hình
              </Button>
            </>
          }
        >
          <div className="carrier-config-modal">
            <div className="carrier-config-intro">
              <Bot size={20} />
              <div>
                <strong>Chế độ chọn nhà vận chuyển</strong>
                <span>
                  AI chỉ xếp hạng các dịch vụ đã vượt qua quyền Shop, khu vực, khả dụng và báo giá.
                </span>
              </div>
            </div>
            <div className="carrier-config-options">
              {AI_MODES.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  className={selectionMode === mode.value ? 'selected' : ''}
                  onClick={() => setSelectionMode(mode.value)}
                >
                  <span className="config-radio">
                    {selectionMode === mode.value && <Check size={13} />}
                  </span>
                  <span>
                    <strong>{mode.title}</strong>
                    <small>{mode.description}</small>
                  </span>
                </button>
              ))}
            </div>

            {(selectionMode === 'default' || selectionMode === 'default-fallback') && (
              <CustomSelect
                label="Nhà vận chuyển mặc định"
                value={defaultCarrier}
                onChange={setDefaultCarrier}
                options={[
                  { value: 'spx-standard', label: 'SPX Express', subLabel: 'Tiêu chuẩn' },
                  { value: 'green-sm-bike', label: 'Green SM Express', subLabel: 'Xe máy' },
                  { value: 'grab-bike', label: 'GrabExpress', subLabel: 'Xe máy' },
                  { value: 'ghn-standard', label: 'GHN', subLabel: 'Tiêu chuẩn' },
                  { value: 'jt-standard', label: 'J&T Express', subLabel: 'Tiêu chuẩn' },
                  { value: 'viettel-standard', label: 'Viettel Post', subLabel: 'Tiêu chuẩn' },
                  { value: 'best-standard', label: 'BEST Express', subLabel: 'Tiêu chuẩn' },
                  { value: 'vnpost-standard', label: 'Vietnam Post', subLabel: 'Tiêu chuẩn' },
                ]}
                icon={Truck}
              />
            )}

            <div className="pickup-override-section">
              <div className="pickup-override-heading">
                <MapPin size={18} />
                <div>
                  <strong>Địa chỉ lấy riêng theo nhà vận chuyển</strong>
                  <span>
                    Mặc định dùng địa chỉ kho; chỉ bật khi muốn NVC tới một điểm lấy khác.
                  </span>
                </div>
              </div>
              {[
                {
                  id: 'green',
                  carrier: 'Green SM Express',
                  enabled: greenOverrideEnabled,
                  setEnabled: setGreenOverrideEnabled,
                  address: greenPickupAddress,
                  setAddress: setGreenPickupAddress,
                },
                {
                  id: 'grab',
                  carrier: 'GrabExpress',
                  enabled: grabOverrideEnabled,
                  setEnabled: setGrabOverrideEnabled,
                  address: grabPickupAddress,
                  setAddress: setGrabPickupAddress,
                },
              ].map((item) => (
                <div className="pickup-override-row" key={item.id}>
                  <CarrierMark carrier={item.carrier} />
                  <div>
                    <strong>{item.carrier}</strong>
                    <span>
                      {item.enabled ? 'Dùng địa chỉ lấy riêng' : 'Dùng địa chỉ kho mặc định'}
                    </span>
                  </div>
                  <button
                    type="button"
                    className={`compact-switch ${item.enabled ? 'on' : ''}`}
                    onClick={() => item.setEnabled(!item.enabled)}
                    aria-label={`Đổi cấu hình điểm lấy ${item.carrier}`}
                  >
                    <span />
                  </button>
                  {item.enabled && (
                    <div className="pickup-override-input">
                      <MapPin size={15} />
                      <input
                        value={item.address}
                        onChange={(event) => item.setAddress(event.target.value)}
                        placeholder="Nhập địa chỉ bưu cục/điểm lấy riêng"
                      />
                      {item.address && (
                        <button
                          type="button"
                          onClick={() => item.setAddress('')}
                          aria-label="Xóa địa chỉ"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="carrier-config-security">
              <ShieldCheck size={16} />
              <span>
                Chuyển phương án dự phòng chỉ được thực hiện khi chuyến cũ đã thất bại rõ ràng, đã
                hủy thành công hoặc đã đối soát không tồn tại.
              </span>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
