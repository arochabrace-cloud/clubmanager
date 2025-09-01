"use client";
import { useEffect } from "react";
import { useForm, Controller, type FieldValues } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Member, MemberStatus } from "@/types/member";
import { MEMBER_STATUS } from "@/types/member";

// Single source of truth for the form
const MemberSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  level: z.string().optional().nullable(),
  status: z.enum(MEMBER_STATUS),
  residentialAddress: z.string().optional(),
  occupation: z.string().optional(),
  nationality: z.string().optional(),
  passportPictureUrl: z.string().url().nullable().optional(),
  outstandingBalance: z.coerce,
});

export type MemberFormValues = z.infer<typeof MemberSchema>;

export default function MemberForm({
  initial,
  onSubmit,
  submitting,
}: {
  initial?: Partial<Member>;
  submitting?: boolean;
  onSubmit: (values: MemberFormValues) => void;
}) {
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(MemberSchema),
    defaultValues: {
      firstName: initial?.firstName ?? "",
      lastName: initial?.lastName ?? "",
      email: initial?.email ?? "",
      phone: initial?.phone ?? "",
      level: initial?.level ?? "",
      status: (initial?.status as MemberStatus) ?? "PROSPECT",
      residentialAddress: initial?.residentialAddress ?? "",
      occupation: initial?.occupation ?? "",
      nationality: initial?.nationality ?? "",
      passportPictureUrl: initial?.passportPictureUrl ?? null,
      outstandingBalance: initial?.outstandingBalance ?? 0,
    },
  });

  useEffect(() => {
    form.reset({
      firstName: initial?.firstName ?? "",
      lastName: initial?.lastName ?? "",
      email: initial?.email ?? "",
      phone: initial?.phone ?? "",
      level: initial?.level ?? "",
      status: (initial?.status as MemberStatus) ?? "PROSPECT",
      residentialAddress: initial?.residentialAddress ?? "",
      occupation: initial?.occupation ?? "",
      nationality: initial?.nationality ?? "",
      passportPictureUrl: initial?.passportPictureUrl ?? null,
      outstandingBalance: initial?.outstandingBalance ?? 0,
    });
  }, [initial, form]);

  return (
    <form
      className="space-y-3"
      onSubmit={form.handleSubmit(onSubmit as (data: FieldValues) => void)}
    >
      <div>
        <Label>First name</Label>
        <Input {...form.register("firstName")} />
        {form.formState.errors.firstName?.message && (
          <p className="text-xs text-red-600">
            {form.formState.errors.firstName.message}
          </p>
        )}
      </div>

      <div>
        <Label>Last name</Label>
        <Input {...form.register("lastName")} />
        {form.formState.errors.lastName?.message && (
          <p className="text-xs text-red-600">
            {form.formState.errors.lastName.message}
          </p>
        )}
      </div>

      <div>
        <Label>Email</Label>
        <Input type="email" {...form.register("email")} />
        {form.formState.errors.email?.message && (
          <p className="text-xs text-red-600">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Label>Phone</Label>
        <Input {...form.register("phone")} />
      </div>

      <div>
        <Label>Status</Label>
        <Controller
          control={form.control}
          name="status"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {MEMBER_STATUS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div>
        <Label>Level (optional)</Label>
        <Input {...form.register("level")} />
      </div>

      <div>
        <Label>Residential Address</Label>
        <Input {...form.register("residentialAddress")} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Label>Occupation</Label>
          <Input {...form.register("occupation")} />
        </div>
        <div>
          <Label>Nationality</Label>
          <Input {...form.register("nationality")} />
        </div>
      </div>

      <div>
        <Label>Passport Picture URL</Label>
        <Input {...form.register("passportPictureUrl")} />
      </div>

      <div>
        <Label>Outstanding Balance (GHS)</Label>
        <Input
          type="number"
          step="0.01"
          {...form.register("outstandingBalance", { valueAsNumber: true })}
        />
        {form.formState.errors.outstandingBalance?.message && (
          <p className="text-xs text-red-600">
            {form.formState.errors.outstandingBalance.message}
          </p>
        )}
      </div>

      <div className="pt-2">
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? "Saving..." : "Save Member"}
        </Button>
      </div>
    </form>
  );
}
