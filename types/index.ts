export interface UserDetails {
  name: string;
  imageUrl: string;
  Rates: string;
  birthDay: string;
  gender: string;
  address: string;
  views: string;
  password: string;
}

export interface BanUserPayload {
  userId: string;
  reason: string;
  bannedBy: string;
}

export interface BanUserPayload {
  userId: string;
  reason: string;
  bannedBy: string;
}

export interface ReportUserPayload {
  reporterId: string;
  reportedUserId: string;
  reason: string;
  details: string;
}

export interface BanStatus {
  isBanned: boolean;
  reason: string | null;
  error?: any;
}

export interface ProductDataprops {
  salesName: string;
  description: string;
  selectedCity: string;
  price: number;
  categories: string[];
  mainPhoto: string;
  descriptionPhotos: string[];
}
