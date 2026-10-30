export interface EventCreator {
  id: string;
  name: string;
  email: string;
  image: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  capacity: number;
  joinedCount: number;
  createdBy: EventCreator;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface EventDetail extends EventItem {
  isJoined: boolean;
}

export interface JoinedEvent extends EventItem {
  joinedAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface EventsResponse {
  events: EventItem[];
}

export interface PaginatedEventsResponse extends EventsResponse {
  pagination: Pagination;
}

export interface EventDetailResponse {
  event: EventDetail;
}

export interface JoinedEventsResponse {
  events: JoinedEvent[];
}

export interface JoinResponse {
  message: string;
  joinedCount: number;
  isJoined: boolean;
}

export interface PlatformStats {
  upcomingEvents: number;
  totalEvents: number;
  totalJoins: number;
  totalVolunteers: number;
}

export interface EventFormValues {
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  capacity: number;
}
