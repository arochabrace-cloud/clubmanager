import { Member, MemberStatus } from "@/types/member";

// src/app/api/members/_store.ts

// Inputs for API/store (optional where appropriate)
export type CreateMemberInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  level?: string | null;
  status?: MemberStatus;
  residentialAddress?: string;
  occupation?: string;
  nationality?: string;
  passportPictureUrl?: string | null;
  outstandingBalance?: number;
};

export type UpdateMemberInput = Partial<CreateMemberInput>;

export const seedMembers: Member[] = [
  {
    id: "m1",
    firstName: "Ama",
    lastName: "Mensah",
    email: "ama.mensah@example.com",
    phone: "+233201111111",
    level: "Bronze",
    status: "PENDING",
    residentialAddress: "123 Ring Road, Accra",
    occupation: "Student",
    nationality: "Ghanaian",
    passportPictureUrl: "/images/members/ama.jpg",
    createdAt: "2025-08-01T09:00:00.000Z",
    outstandingBalance: 0,
  },
  {
    id: "m2",
    firstName: "Kwame",
    lastName: "Boateng",
    email: "kwame.boateng@example.com",
    phone: "+233202222222",
    level: "Silver",
    status: "ACTIVE",
    residentialAddress: "45 High Street, Kumasi",
    occupation: "Banker",
    nationality: "Ghanaian",
    passportPictureUrl: "/images/members/kwame.jpg",
    createdAt: "2025-07-22T11:30:00.000Z",
    outstandingBalance: 0,
  },
  {
    id: "m3",
    firstName: "Akosua",
    lastName: "Owusu",
    email: "akosua.owusu@example.com",
    phone: "+233203333333",
    level: "Gold",
    status: "SUSPENDED",
    residentialAddress: "12 Independence Ave, Cape Coast",
    occupation: "Nurse",
    nationality: "Ghanaian",
    passportPictureUrl: "/images/members/akosua.jpg",
    createdAt: "2025-06-15T14:45:00.000Z",
    outstandingBalance: 0,
  },
  {
    id: "m4",
    firstName: "Kojo",
    lastName: "Asare",
    email: "kojo.asare@example.com",
    phone: "+233204444444",
    level: null,
    status: "PROSPECT",
    residentialAddress: "No. 7 Adabraka Lane, Accra",
    occupation: "Entrepreneur",
    nationality: "Ghanaian",
    passportPictureUrl: null,
    createdAt: "2025-08-20T16:20:00.000Z",
    outstandingBalance: 0,
  },
  {
    id: "m5",
    firstName: "Esi",
    lastName: "Quaye",
    email: "esi.quaye@example.com",
    phone: "+233205555555",
    level: "Platinum",
    status: "ACTIVE",
    residentialAddress: "Airport Residential Area, Accra",
    occupation: "Engineer",
    nationality: "Ghanaian",
    passportPictureUrl: "/images/members/esi.jpg",
    createdAt: "2025-07-05T08:15:00.000Z",
    outstandingBalance: 0,
  },
  {
    id: "m6",
    firstName: "Yaw",
    lastName: "Amoako",
    email: "yaw.amoako@example.com",
    phone: "+233206666666",
    level: "Bronze",
    status: "PENDING",
    residentialAddress: "Sunyani Road, Takoradi",
    occupation: "Teacher",
    nationality: "Ghanaian",
    passportPictureUrl: "/images/members/yaw.jpg",
    createdAt: "2025-08-10T10:05:00.000Z",
    outstandingBalance: 0,
  },
];

// --- In-memory DB ---
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
    level: input.level ?? null,
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
    // normalize fields that can be null/undefined
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
