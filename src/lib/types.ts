export type AttendanceStatus = 'attending' | 'declined';

export interface RSVPRecord {
  id: string;
  guest_name: string;
  phone?: string | null;
  attendance_status: AttendanceStatus;
  guest_count: number;
  companion_names: string[];
  dietary_restrictions?: string | null;
  message?: string | null;
  invitation_code?: string | null;
  created_at: string;
  updated_at: string;
}

export type GiftPreferenceType = 'bank' | 'registry' | 'both';
export type InvitationScopeType = 'church_only' | 'church_and_reception';

export interface GuestInvite {
  id: string;
  code: string;
  full_name: string;
  phone?: string | null;
  max_guests: number;
  status: 'pending' | 'confirmed' | 'declined';
  confirmed_count?: number;
  group?: string | null;
  notes?: string | null;
  gift_type?: GiftPreferenceType;
  invitation_scope?: InvitationScopeType;
  created_at: string;
  updated_at?: string;
}

export interface RSVPFormData {
  guest_name: string;
  attendance_status: AttendanceStatus;
  guest_count: number;
  companion_names: string[];
  dietary_restrictions?: string;
  phone?: string;
  message?: string;
  invitation_code?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  isDemoMode?: boolean;
}
