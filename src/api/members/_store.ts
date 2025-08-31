// src/app/api/members/_store.ts
import { Member } from "@/types/member";

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
  },
];

// --- In-memory DB ---
let db: Member[] = [...seedMembers]; // start with seed data

// --- CRUD helpers ---
export function listMembers(): Member[] {
  return db.slice().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getMember(id: string): Member | undefined {
  return db.find((m) => m.id === id);
}

export function createMember(input: Omit<Member, "id" | "createdAt">): Member {
  const id = `m${Math.random().toString(36).slice(2, 8)}`;
  const createdAt = new Date().toISOString();
  const member: Member = { id, createdAt, ...input };
  db.unshift(member);
  return member;
}

export function updateMember(
  id: string,
  patch: Partial<Omit<Member, "id" | "createdAt">>
): Member | undefined {
  const idx = db.findIndex((m) => m.id === id);
  if (idx === -1) return undefined;
  db[idx] = { ...db[idx], ...patch };
  return db[idx];
}

export function deleteMember(id: string): boolean {
  const idx = db.findIndex((m) => m.id === id);
  if (idx === -1) return false;
  db.splice(idx, 1);
  return true;
}
