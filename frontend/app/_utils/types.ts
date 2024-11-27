export type Filter = {
  name: string;
  value: string;
};

export interface Guest {
  fullName: string;
  email: string;
}

export interface Cabin {
  _id: string;
  name: string;
  maxCapacity: number;
  discount: number;
  image: string;
  description: string;
  regularPrice: number;
}

export interface CabinData {
  name: string;
  maxCapacity: number;
  discount: number;
  image: string | undefined;
  regularPrice: number;
  description: string;
}
export interface Booking {
  _id: string;
  bookingId: string;
  extrasPrice: number;
  created_at: string;
  status: string;
  numNights: number;
  startDate: string;
  endDate: string;
  hasBreakfast: boolean;
  totalPrice: number;
  numGuests: number;
  observations?: string;
  guest: {
    fullName: string;
    countryFlag: string;
    email: string;
    nationalId?: string;
  };
  cabin: {
    regularPrice: number;
    name: string;
  };
}

export interface BookingParams {
  page: string;
  status: string;
  sortBy: string;
}

export interface Settings {
  breakFastPrice: number;
}

export interface BookingData {
  startDate?: Date;
  endDate?: Date;
  numNights?: number;
  totalPrice?: number;
  status: string;
  guest?: Guest;
  cabin?: Cabin;
}

export type BookingRowProps = {
  booking?: Booking;
  cabin?: Cabin;
};
