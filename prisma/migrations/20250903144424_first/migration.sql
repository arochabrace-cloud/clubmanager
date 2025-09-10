-- CreateEnum
CREATE TYPE "public"."MemberStatus" AS ENUM ('PROSPECT', 'PENDING', 'ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "public"."MemberCategory" AS ENUM ('GOLD', 'SILVER', 'BRONZE', 'VIP', 'BEGINNER');

-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."MembershipLevel" AS ENUM ('ORDINARY', 'EXECUTIVE', 'DELEGATE', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."EducationLevel" AS ENUM ('PRIMARY', 'SECONDARY', 'TERTIARY', 'POSTGRADUATE', 'VOCATIONAL', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."UserRole" AS ENUM ('ADMIN', 'MEMBER');

-- CreateTable
CREATE TABLE "public"."members" (
    "id" TEXT NOT NULL,
    "membershipId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "public"."Gender" NOT NULL,
    "nationalId" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "residentialAddress" TEXT NOT NULL,
    "regionConstituencyElectoralArea" TEXT NOT NULL,
    "email" TEXT,
    "occupation" TEXT,
    "highestEducationLevel" "public"."EducationLevel",
    "membershipLevel" "public"."MembershipLevel" NOT NULL,
    "branchWard" TEXT,
    "recruitedBy" TEXT,
    "level" "public"."MemberCategory" NOT NULL DEFAULT 'BEGINNER',
    "status" "public"."MemberStatus" NOT NULL DEFAULT 'PROSPECT',
    "outstandingBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "passportPictureUrl" TEXT,
    "nationality" TEXT,

    CONSTRAINT "members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "role" "public"."UserRole" NOT NULL DEFAULT 'MEMBER',
    "memberId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "members_membershipId_key" ON "public"."members"("membershipId");

-- CreateIndex
CREATE UNIQUE INDEX "members_nationalId_key" ON "public"."members"("nationalId");

-- CreateIndex
CREATE UNIQUE INDEX "members_email_key" ON "public"."members"("email");

-- CreateIndex
CREATE INDEX "members_email_idx" ON "public"."members"("email");

-- CreateIndex
CREATE INDEX "members_phone_idx" ON "public"."members"("phone");

-- CreateIndex
CREATE INDEX "members_nationalId_idx" ON "public"."members"("nationalId");

-- CreateIndex
CREATE INDEX "members_membershipId_idx" ON "public"."members"("membershipId");

-- CreateIndex
CREATE INDEX "members_status_idx" ON "public"."members"("status");

-- CreateIndex
CREATE INDEX "members_membershipLevel_idx" ON "public"."members"("membershipLevel");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_memberId_key" ON "public"."users"("memberId");

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."members"("id") ON DELETE SET NULL ON UPDATE CASCADE;
