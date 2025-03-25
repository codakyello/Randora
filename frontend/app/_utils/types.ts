export type Filter = {
  name: string;
  value: string;
};

export type Collaborator = {
  _id: string;
  user: {
    _id: string;
    userName: string;
    email: string;
    image: string;
  };
  status: string;
};

// Type when creating Cabin
export interface User {
  _id?: string;
  userName?: string;
  name?: string;
  phone?: string;
  email?: string;
  accountType?: string;
  image: string;
  organisationId?: string;
  subscriptionStatus?: string;
  accounts?: Array<OrgAccount>;
}

export interface AccountUser {
  _id: string;
  image: string;
  userName: string;
}

export interface OrgAccount {
  _id: string;
  organisation: Organisation;
  organisationImage: OrgImage;
}

export interface OrgImage {
  image: string;
}

export interface Event {
  _id: string;
  name: string;
  type: string;
  status: string;
  emailSent: boolean;
  startDate: string;
  endDate: string;
  participantCount: number;
  prizeCount: number;
  remainingPrize: number;
  organisationId?: string;
  userId?: string;
}

export interface EventForm {
  name?: string;
  type?: string;
  status?: string;
  startDate?: string;
}

export interface Participant {
  _id: string;
  name: string;
  email: string;
  ticketNumber: string;
  isWinner: boolean;
  prize: Prize;
}
export interface Winner {
  ticketNumber: string;
  prize: string;
  image: string;
}

export interface ParticipantForm {
  name?: string | undefined;
  email?: string | undefined;
  ticketNumber?: string;
  eventId?: string;
  isWinner?: boolean;
  prizeId?: string;
}

export interface PrizeForm {
  name?: string;
  image?: string;
  quantity?: number;
  eventId?: string;
}

export interface Prize {
  _id: string;
  name: string;
  image: string;
  quantity: number;
}

export interface BookingParams {
  page: string;
  status: string;
  sortBy: string;
}

export interface Settings {
  breakFastPrice: number;
}

export interface Organisation {
  _id: string;
  name: string;
  brandColor: string;
  textLogo: string;
  coverLogo: string;
  subscriptionStatus: string;
}

export type BookingRowProps = {
  event?: Event;
  participant?: Participant;
};

export interface SettingsRandora {
  _id?: string;
  brandColor?: string;
  textLogo?: string;
  coverLogo?: string;
  name?: string;
}

export type planType = {
  name: string;
  price: number;
  features: { included: boolean; feature: string }[];
};
