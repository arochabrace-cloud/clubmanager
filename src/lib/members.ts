import { db } from './db';
import { Member as PrismaMember } from '../generated/prisma';
import { Member, MemberCategory, MemberStatus, Gender, MembershipLevel, EducationLevel } from '@/types/member';

// Type for creating a member through the API
export type CreateMemberInput = {
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO date string
  gender: Gender;
  nationalId: string;
  phone: string;
  residentialAddress: string;
  regionConstituencyElectoralArea: string;
  
  // Optional fields
  email?: string;
  occupation?: string;
  highestEducationLevel?: EducationLevel;
  
  // Membership details
  membershipLevel: MembershipLevel;
  branchWard?: string;
  recruitedBy?: string;
  
  // System fields
  level?: MemberCategory;
  status?: MemberStatus;
  
  // Legacy/attachment fields
  nationality?: string;
  passportPictureUrl?: string;
  outstandingBalance?: number;
};

export type UpdateMemberInput = Partial<CreateMemberInput>;

// Function to convert Prisma member to frontend Member type
export function prismaToMember(prismaMember: PrismaMember): Member {
  return {
    id: prismaMember.id,
    membershipId: prismaMember.membershipId || undefined,
    createdAt: prismaMember.createdAt.toISOString(),
    
    // Personal information
    firstName: prismaMember.firstName,
    lastName: prismaMember.lastName,
    dateOfBirth: prismaMember.dateOfBirth.toISOString().split('T')[0], // YYYY-MM-DD format
    gender: prismaMember.gender,
    nationalId: prismaMember.nationalId,
    phone: prismaMember.phone,
    residentialAddress: prismaMember.residentialAddress,
    regionConstituencyElectoralArea: prismaMember.regionConstituencyElectoralArea,
    
    // Optional fields
    email: prismaMember.email || undefined,
    occupation: prismaMember.occupation || undefined,
    highestEducationLevel: prismaMember.highestEducationLevel || undefined,
    
    // Membership details
    membershipLevel: prismaMember.membershipLevel,
    branchWard: prismaMember.branchWard || undefined,
    recruitedBy: prismaMember.recruitedBy || undefined,
    
    // System fields
    level: prismaMember.level,
    status: prismaMember.status,
    outstandingBalance: prismaMember.outstandingBalance,
    
    // Attachments
    passportPictureUrl: prismaMember.passportPictureUrl || undefined,
    
    // Legacy fields
    nationality: prismaMember.nationality || undefined,
  };
}

// Member service functions
export class MemberService {
  static async getAllMembers(searchQuery?: string): Promise<Member[]> {
    const whereClause = searchQuery ? {
      OR: [
        {
          firstName: {
            contains: searchQuery,
            mode: 'insensitive' as const,
          },
        },
        {
          lastName: {
            contains: searchQuery,
            mode: 'insensitive' as const,
          },
        },
        {
          email: {
            contains: searchQuery,
            mode: 'insensitive' as const,
          },
        },
        {
          nationalId: {
            contains: searchQuery,
            mode: 'insensitive' as const,
          },
        },
        {
          phone: {
            contains: searchQuery,
            mode: 'insensitive' as const,
          },
        },
      ],
    } : {};

    const prismaMembers = await db.member.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return prismaMembers.map(prismaToMember);
  }

  static async getMemberById(id: string): Promise<Member | null> {
    const prismaMember = await db.member.findUnique({
      where: { id },
    });

    if (!prismaMember) return null;
    return prismaToMember(prismaMember);
  }

  static async createMember(input: CreateMemberInput): Promise<Member> {
    // Generate membership ID
    const membershipId = `MEM${Date.now().toString().slice(-8)}`;
    
    const prismaMember = await db.member.create({
      data: {
        membershipId,
        firstName: input.firstName,
        lastName: input.lastName,
        dateOfBirth: new Date(input.dateOfBirth),
        gender: input.gender,
        nationalId: input.nationalId,
        phone: input.phone,
        residentialAddress: input.residentialAddress,
        regionConstituencyElectoralArea: input.regionConstituencyElectoralArea,
        
        // Optional fields
        email: input.email || null,
        occupation: input.occupation || null,
        highestEducationLevel: input.highestEducationLevel || null,
        
        // Membership details
        membershipLevel: input.membershipLevel,
        branchWard: input.branchWard || null,
        recruitedBy: input.recruitedBy || null,
        
        // System fields
        level: input.level || 'BEGINNER',
        status: input.status || 'PROSPECT',
        outstandingBalance: input.outstandingBalance || 0,
        
        // Attachments
        passportPictureUrl: input.passportPictureUrl || null,
        
        // Legacy fields
        nationality: input.nationality || null,
      },
    });

    return prismaToMember(prismaMember);
  }

  static async updateMember(id: string, input: UpdateMemberInput): Promise<Member | null> {
    try {
      const updateData: any = {};
      
      // Handle date conversion if dateOfBirth is provided
      if (input.dateOfBirth) {
        updateData.dateOfBirth = new Date(input.dateOfBirth);
      }
      
      // Add other fields, filtering out undefined values
      Object.keys(input).forEach(key => {
        if (key !== 'dateOfBirth' && input[key as keyof UpdateMemberInput] !== undefined) {
          updateData[key] = input[key as keyof UpdateMemberInput];
        }
      });

      const prismaMember = await db.member.update({
        where: { id },
        data: updateData,
      });

      return prismaToMember(prismaMember);
    } catch (error) {
      console.error('Error updating member:', error);
      return null;
    }
  }

  static async deleteMember(id: string): Promise<boolean> {
    try {
      await db.member.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      console.error('Error deleting member:', error);
      return false;
    }
  }
}
