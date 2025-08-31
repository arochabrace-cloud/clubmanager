export const MEMBER_STATUS = [
  "PROSPECT",
  "PENDING",
  "ACTIVE",
  "SUSPENDED",
] as const;

export type MemberStatus = (typeof MEMBER_STATUS)[number];

export type Member = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  level?: string | null; // Membership level
  status: MemberStatus;

  // New fields
  residentialAddress: string;
  occupation?: string;
  nationality?: string;
  passportPictureUrl?: string | null; // store URL/path to uploaded file

  createdAt: string; // ISO
};
