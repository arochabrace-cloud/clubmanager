export const MEMBER_STATUS = [
  "PROSPECT",
  "PENDING",
  "ACTIVE",
  "SUSPENDED",
] as const;

export const CATEGORY = ["GOLD", "SILVER", "BRONZE", "VIP"] as const;

export type MemberStatus = (typeof MEMBER_STATUS)[number];
export type MemberCategory = (typeof CATEGORY)[number];
export type Member = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  level: MemberCategory;
  status: MemberStatus;
  outstandingBalance: number;

  // keep these OPTIONAL:
  residentialAddress?: string;
  occupation?: string;
  nationality?: string;
  passportPictureUrl?: string | null;

  createdAt: string; // ISO
};
