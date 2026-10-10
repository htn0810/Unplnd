/**
 * Vietnam's 34 provincial-level units after the July 2025 merger (6 cities + 28 provinces).
 * Coordinates are approximate administrative centers — enough for map framing in the mock.
 */
export const PROVINCES = [
  { id: 'ha-noi', name: 'Hà Nội', nameEn: 'Hanoi', lat: 21.0285, lng: 105.8542, emoji: '🏛️' },
  { id: 'hue', name: 'Huế', nameEn: 'Hue', lat: 16.4637, lng: 107.5909, emoji: '🏯' },
  { id: 'hai-phong', name: 'Hải Phòng', nameEn: 'Hai Phong', lat: 20.8449, lng: 106.6881, emoji: '⚓' },
  { id: 'da-nang', name: 'Đà Nẵng', nameEn: 'Da Nang', lat: 16.0544, lng: 108.2022, emoji: '🌉' },
  { id: 'ho-chi-minh', name: 'TP. Hồ Chí Minh', nameEn: 'Ho Chi Minh City', lat: 10.7769, lng: 106.7009, emoji: '🛵' },
  { id: 'can-tho', name: 'Cần Thơ', nameEn: 'Can Tho', lat: 10.0452, lng: 105.7469, emoji: '🛶' },
  { id: 'tuyen-quang', name: 'Tuyên Quang', nameEn: 'Tuyen Quang', lat: 21.8236, lng: 105.2141, emoji: '⛰️' },
  { id: 'cao-bang', name: 'Cao Bằng', nameEn: 'Cao Bang', lat: 22.6657, lng: 106.2577, emoji: '💧' },
  { id: 'lai-chau', name: 'Lai Châu', nameEn: 'Lai Chau', lat: 22.3964, lng: 103.4589, emoji: '🏔️' },
  { id: 'lao-cai', name: 'Lào Cai', nameEn: 'Lao Cai', lat: 22.3364, lng: 103.8438, emoji: '🌾' },
  { id: 'thai-nguyen', name: 'Thái Nguyên', nameEn: 'Thai Nguyen', lat: 21.5942, lng: 105.8482, emoji: '🍵' },
  { id: 'dien-bien', name: 'Điện Biên', nameEn: 'Dien Bien', lat: 21.386, lng: 103.023, emoji: '🌄' },
  { id: 'lang-son', name: 'Lạng Sơn', nameEn: 'Lang Son', lat: 21.8537, lng: 106.7615, emoji: '🗻' },
  { id: 'son-la', name: 'Sơn La', nameEn: 'Son La', lat: 21.3256, lng: 103.9188, emoji: '🍑' },
  { id: 'phu-tho', name: 'Phú Thọ', nameEn: 'Phu Tho', lat: 21.3227, lng: 105.4019, emoji: '🛕' },
  { id: 'bac-ninh', name: 'Bắc Ninh', nameEn: 'Bac Ninh', lat: 21.1861, lng: 106.0763, emoji: '🎶' },
  { id: 'quang-ninh', name: 'Quảng Ninh', nameEn: 'Quang Ninh', lat: 20.9599, lng: 107.0425, emoji: '🛳️' },
  { id: 'hung-yen', name: 'Hưng Yên', nameEn: 'Hung Yen', lat: 20.6464, lng: 106.0511, emoji: '🍈' },
  { id: 'ninh-binh', name: 'Ninh Bình', nameEn: 'Ninh Binh', lat: 20.2506, lng: 105.9745, emoji: '🚣' },
  { id: 'thanh-hoa', name: 'Thanh Hóa', nameEn: 'Thanh Hoa', lat: 19.8067, lng: 105.7852, emoji: '🏖️' },
  { id: 'nghe-an', name: 'Nghệ An', nameEn: 'Nghe An', lat: 18.6796, lng: 105.6813, emoji: '🌿' },
  { id: 'ha-tinh', name: 'Hà Tĩnh', nameEn: 'Ha Tinh', lat: 18.3428, lng: 105.9057, emoji: '🌊' },
  { id: 'quang-tri', name: 'Quảng Trị', nameEn: 'Quang Tri', lat: 17.4833, lng: 106.6, emoji: '🕳️' },
  { id: 'quang-ngai', name: 'Quảng Ngãi', nameEn: 'Quang Ngai', lat: 15.1205, lng: 108.7923, emoji: '🏝️' },
  { id: 'gia-lai', name: 'Gia Lai', nameEn: 'Gia Lai', lat: 13.782, lng: 109.219, emoji: '🌅' },
  { id: 'khanh-hoa', name: 'Khánh Hòa', nameEn: 'Khanh Hoa', lat: 12.2388, lng: 109.1967, emoji: '🤿' },
  { id: 'lam-dong', name: 'Lâm Đồng', nameEn: 'Lam Dong', lat: 11.9404, lng: 108.4583, emoji: '🌲' },
  { id: 'dak-lak', name: 'Đắk Lắk', nameEn: 'Dak Lak', lat: 12.6667, lng: 108.05, emoji: '☕' },
  { id: 'dong-nai', name: 'Đồng Nai', nameEn: 'Dong Nai', lat: 10.9574, lng: 106.8427, emoji: '🌳' },
  { id: 'tay-ninh', name: 'Tây Ninh', nameEn: 'Tay Ninh', lat: 11.31, lng: 106.098, emoji: '⛰️' },
  { id: 'vinh-long', name: 'Vĩnh Long', nameEn: 'Vinh Long', lat: 10.2537, lng: 105.9722, emoji: '🥥' },
  { id: 'dong-thap', name: 'Đồng Tháp', nameEn: 'Dong Thap', lat: 10.46, lng: 105.6325, emoji: '🪷' },
  { id: 'ca-mau', name: 'Cà Mau', nameEn: 'Ca Mau', lat: 9.1769, lng: 105.1524, emoji: '🦀' },
  { id: 'an-giang', name: 'An Giang', nameEn: 'An Giang', lat: 10.3854, lng: 105.4357, emoji: '🏝️' },
] as const

export type Province = (typeof PROVINCES)[number]
export type ProvinceId = Province['id']

/** "Near me" in the mock is Ho Chi Minh City (the demo user's location) */
export const HOME_PROVINCE: ProvinceId = 'ho-chi-minh'

export const MAX_TRIP_DAYS = 7

const BY_ID = new Map<string, Province>(PROVINCES.map((province) => [province.id, province]))

export const getProvince = (id: string) => BY_ID.get(id) ?? BY_ID.get(HOME_PROVINCE)!

export const provinceName = (id: string, language: string | undefined) => {
  const province = getProvince(id)
  return language === 'vi' ? province.name : province.nameEn
}
