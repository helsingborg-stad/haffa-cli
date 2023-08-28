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

export interface Image {
  url: string;
}

type RawAdvertWithoutImages = Omit<RawAdvert, "images">;

export interface AdvertExportedFromAWS extends RawAdvertWithoutImages {
  createdByUser: string;
  images?: Image[];
}
