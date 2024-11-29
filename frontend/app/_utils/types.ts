export type Filter = {
  name: string;
  value: string;
};

// Type when creating Cabin

export interface Event {
  _id: string;
  name: string;
  type: string;
  status: string;
  emailSent: boolean;
  startDate: string;
  endDate: string;
  participantCount: number;
}

export interface EventForm {
  name: string;
  type: string;
  status: string;
  emailSent: boolean;
  startDate: string;
}

export interface Participant {
  _id: string;
  name: string;
  email: string;
  ticketNumber: string;
  isWinner: boolean;
}

export interface ParticipantForm {
  name: string | undefined;
  email: string | undefined;
  ticketNumber: string;
  eventId: string;
}

export interface BookingParams {
  page: string;
  status: string;
  sortBy: string;
}

export interface Settings {
  breakFastPrice: number;
}

export type BookingRowProps = {
  event?: Event;
  participant?: Participant;
};
