export enum BorrowStatus {
  available = "available",
  pickedUp = "pickedUp",
  returned = "returned",
  cancelled = "cancelled",
  booked = "booked",
  reserved = "reserved",
}

export enum ItemStatus {
  available = "available",
  reserved = "reserved",
  pickedUp = "pickedUp",
}

export type ItemAMaterialInput = {
  wood?: boolean | null;
  plastic?: boolean | null;
  metal?: boolean | null;
  other?: boolean | null;
};

export enum ItemCondition {
  Anew = "Anew",
  Bgood = "Bgood",
  Cworn = "Cworn",
}

export enum QuantityUnit {
  kg = "kg",
  hg = "hg",
  g = "g",
  l = "l",
  dl = "dl",
  cl = "cl",
  m3 = "m3",
  m2 = "m2",
  m = "m",
  st = "st",
}

export enum ItemAdvertType {
  recycle = "recycle",
  borrow = "borrow",
}

export type RawAdvert = {
  __typename: "Advert";
  id: string;
  title: string;
  description?: string | null;
  height?: string | null;
  width?: string | null;
  length?: string | null;
  borrowStatus?: BorrowStatus | null;
  status?: ItemStatus | null;
  category?: string | null;
  material?: Array<ItemAMaterial> | null;
  condition?: ItemCondition | null;
  conditionValue?: string | null;
  color?: string | null;
  areaOfUse?: Array<ItemAreaOfUse> | null;
  images?: Array<ItemImages> | null;
  quantity?: number | null;
  quantityUnit?: QuantityUnit | null;
  department?: string | null;
  instructions?: string | null;
  contactPerson?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  giver?: string | null;
  version: number;
  climateImpact?: number | null;
  reservedBySub?: string | null;
  reservedByName?: string | null;
  revisions?: number | null;
  purchasePrice?: string | null;
  company?: string | null;
  aterbruketId?: string | null;
  advertType: ItemAdvertType;
  missingItemsInformation?: string | null;
  pickUpInformation?: string | null;
  lockerCodeInformation?: string | null;
  lockerCode?: string | null;
  returnInformation?: string | null;
  reservationDate?: string | null;
  pickUpInstructions?: string | null;
  accessories: Array<string>;
  borrowDifficultyLevel?: string | null;
  toPickUpBySubs?: Array<string> | null;
  pickedUpBySubs?: Array<string> | null;
  advertBorrowCalendar?: AdvertBorrowCalendar | null;
  advertPickUps?: Array<AdvertPickUp> | null;
  accessRestriction?: string | null;
  accessRestrictionSelection?: Administration | null;
  address?: string | null;
  city?: string | null;
  postalCode?: string | null;
  missingAccessories?: Array<MissingAccessories> | null;
  createdAt: string;
  updatedAt: string;
};

export type MissingAccessories = {
  __typename: "MissingAccessories";
  reportedBy: string;
  reportedDate: string;
  accessories: Array<string>;
  lastReturnedBy: string;
};

export type ItemAMaterial = {
  __typename: "ItemAMaterial";
  wood?: boolean | null;
  plastic?: boolean | null;
  metal?: boolean | null;
  other?: boolean | null;
};

export type ItemAreaOfUse = {
  __typename: "ItemAreaOfUse";
  indoors?: boolean | null;
  outside?: boolean | null;
};

export type ItemImages = {
  __typename: "ItemImages";
  src?: string | null;
  alt?: string | null;
};

export type AdvertBorrowCalendar = {
  __typename: "AdvertBorrowCalendar";
  allowedDateStart?: string | null;
  allowedDateEnd?: string | null;
  calendarEvents?: Array<CalendarEvent> | null;
};

export type CalendarEvent = {
  __typename: "CalendarEvent";
  borrowedBySub?: string | null;
  status?: BorrowStatus | null;
  dateStart?: string | null;
  dateEnd?: string | null;
  returnDateTime?: string | null;
  quantity?: number | null;
};

export type AdvertPickUp = {
  __typename: "AdvertPickUp";
  reservedBySub: string;
  quantity: number;
  reservationDate: string;
  pickedUp?: boolean | null;
};

export type Administration = {
  __typename: "Administration";
  arbetsmarknadsforvaltningen?: boolean | null;
  fastighetsforvaltningen?: boolean | null;
  kulturforvaltningen?: boolean | null;
  miljoforvaltningen?: boolean | null;
  skolOchFritidsforvaltningen?: boolean | null;
  socialforvaltningen?: boolean | null;
  stadsbyggnadsforvaltningen?: boolean | null;
  stadsledningsforvaltningen?: boolean | null;
  vardOchOmsorgsforvaltningen?: boolean | null;
};

/**
 * Backup advert
 */

type RawAdverImagesOmitted = Omit<RawAdvert, "images">;

export interface Image {
  url: string;
}

export interface BackupAdvert extends RawAdverImagesOmitted {
  images?: Image[];
}

/**
 *  Haffa v1.0 types
 */

export interface AdvertUserFields {
  title: string;
  description: string;
  quantity: number;
  images: Image[];
  unit: string;
  material: string;
  condition: string;
  usage: string;
  location: AdvertLocation;
  contact: AdvertContact;
}

export interface AdvertLocation {
  adress: string;
  zipCode: string;
  city: string;
  country: string;
}

export interface AdvertContact {
  phone: string;
  email: string;
}

export interface Advert extends AdvertUserFields {
  meta: AdvertMeta;
  id: string;
  createdAt: string;
}

export interface AdvertMeta {
  reservableQuantity: number;
  collectableQuantity: number;
  canEdit: boolean;
  canRemove: boolean;
  canBook: boolean;
  canReserve: boolean;
  canCancelReservation: boolean;
  canCollect: boolean;
  claims: AdvertClaim[];
}

export enum AdvertClaimType {
  reserved = "reserved",
  collected = "collected",
}

export interface AdvertClaim {
  quantity: number;
  by: string;
  at: string;
  type: AdvertClaimType;
}

export interface AdvertTerms {
  unit: string[];
  material: string[];
  condition: string[];
  usage: string[];
}

export interface AdvertMutationResult {
  status: AdvertMutationStatus | null;
  advert: Advert;
}

export interface AdvertMutationStatus {
  code: string;
  message: string;
  field: string;
}

export type FilterInput<T> = {
  ne?: T;
  eq?: T;
  gt?: T;
  gte?: T;
  lt?: T;
  lte?: T;
} & (T extends string ? { contains?: string } : Record<string, never>);

export type AdvertFieldsFilterInput = {
  id?: FilterInput<string>;
} & {
  [Property in keyof Omit<AdvertUserFields, "images">]?: FilterInput<
    AdvertUserFields[Property]
  >;
};

export interface AdvertRestrictionsFilterInput {
  canBeReserved?: boolean;
  reservedByMe?: boolean;
  createdByMe?: boolean;
}

export interface AdvertSorting {
  field?: "title" | "createdAt";
  ascending?: boolean;
}

export interface AdvertFilterInput {
  search?: string;
  fields?: AdvertFieldsFilterInput;
  restrictions?: AdvertRestrictionsFilterInput;
  sorting?: AdvertSorting;
}

export interface AdvertInput {
  title: string;
  description: string;
  quantity: number;
  images: Image[];
  unit: string;
  material: string;
  condition: string;
  usage: string;
  location: AdvertLocation;
  contact: AdvertContact;
}

export interface AdvertsRepository {
  getTerms: () => Promise<AdvertTerms>;
  getAdvert: (id: string) => Promise<Advert>;
  listAdverts: (
    searchParams?: AdvertFilterInput,
    init?: Pick<RequestInit, "signal">,
  ) => Promise<Advert[]>;
  createAdvert: (input: AdvertInput) => Promise<AdvertMutationResult>;
  updateAdvert: (
    id: string,
    input: AdvertInput,
  ) => Promise<AdvertMutationResult>;
  removeAdvert: (id: string) => Promise<AdvertMutationResult>;
  reserveAdvert: (
    id: string,
    quantity: number,
  ) => Promise<AdvertMutationResult>;
  cancelAdvertReservation: (id: string) => Promise<AdvertMutationResult>;
  collectAdvert: (
    id: string,
    quantity: number,
  ) => Promise<AdvertMutationResult>;
}
