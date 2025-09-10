import { Member, type MemberCategory, type MemberStatus } from "@/types/member";

// Inputs for API/store
export type CreateMemberInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  level?: MemberCategory;
  status?: MemberStatus;
  residentialAddress?: string;
  occupation?: string;
  nationality?: string;
  passportPictureUrl?: string | null;
  outstandingBalance?: number;
};
export type UpdateMemberInput = Partial<CreateMemberInput>;

// --- Sample dataset ---
export const seedMembers: Member[] = [
  {
    id: "m1",
    firstName: "Ama",
    lastName: "Mensah",
    email: "ama.mensah@example.com",
    phone: "+233201111111",
    level: "BRONZE",
    status: "PENDING",
    residentialAddress: "123 Ring Road, Accra",
    occupation: "Student",
    nationality: "Ghanaian",
    passportPictureUrl: "/images/members/ama.jpg",
    outstandingBalance: 120.0,
    createdAt: "2025-08-01T09:00:00.000Z",
    dateOfBirth: "",
    gender: "",
    nationalId: "",
    regionConstituencyElectoralArea: "",
    membershipLevel: "",
  },
  {
    id: "m2",
    firstName: "Kwame",
    lastName: "Boateng",
    email: "kwame.boateng@example.com",
    phone: "+233202222222",
    level: "SILVER",
    status: "ACTIVE",
    residentialAddress: "45 High Street, Kumasi",
    occupation: "Banker",
    nationality: "Ghanaian",
    passportPictureUrl: "/images/members/kwame.jpg",
    outstandingBalance: 0.0,
    createdAt: "2025-07-22T11:30:00.000Z",
    dateOfBirth: "",
    gender: "",
    nationalId: "",
    regionConstituencyElectoralArea: "",
    membershipLevel: "",
  },
  // ...keep the rest of your seeds...
];

// In-memory DB (mutate array, don’t reassign variable)
const db: Member[] = [...seedMembers];

export function listMembers(): Member[] {
  return db.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
export function getMember(id: string): Member | undefined {
  return db.find((m) => m.id === id);
}
export function createMember(input: CreateMemberInput): Member {
  const id = `m${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = new Date().toISOString();
  const member: Member = {
    id,
    createdAt,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email,
    phone: input.phone,
    level: input.level ?? "BEGINNER",
    status: input.status ?? "PROSPECT",
    residentialAddress: input.residentialAddress,
    occupation: input.occupation,
    nationality: input.nationality,
    passportPictureUrl: input.passportPictureUrl ?? null,
    outstandingBalance: input.outstandingBalance ?? 0,
  };
  db.unshift(member);
  return member;
}
export function updateMember(
  id: string,
  patch: UpdateMemberInput
): Member | undefined {
  const idx = db.findIndex((m) => m.id === id);
  if (idx === -1) return undefined;
  const current = db[idx];
  db[idx] = {
    ...current,
    ...patch,
    level: patch.level === undefined ? current.level : patch.level,
    passportPictureUrl:
      patch.passportPictureUrl === undefined
        ? current.passportPictureUrl
        : patch.passportPictureUrl,
    outstandingBalance:
      patch.outstandingBalance === undefined
        ? current.outstandingBalance
        : patch.outstandingBalance,
  };
  return db[idx];
}
export function deleteMember(id: string): boolean {
  const idx = db.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  db.splice(idx, 1);
  return true;
}
