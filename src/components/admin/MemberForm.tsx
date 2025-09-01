"use client";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Member, MemberStatus } from "@/types/member";
import { MEMBER_STATUS } from "@/types/member";

// Optional: supply available membership levels from API/store
type Level = { id: string; name: string };

const MemberSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Provide a valid email"),
  phone: z.string().optional(),
  // Membership Level (string id). Optional, but validated if present
  level: z.string().optional().nullable(),
  status: z.enum(MEMBER_STATUS),

  // New fields
  residentialAddress: z.string().min(5, "Residential address is required"),
  occupation: z.string().optional(),
  nationality: z.string().optional(),

  // File input – optional; if provided ensure it's an image under ~5MB
  passportPicture: z
    .any()
    .optional()
    .refine(
      (fileList) =>
        !fileList ||
        !fileList.length ||
        (fileList.length === 1 &&
          ["image/jpeg", "image/png", "image/webp"].includes(
            fileList[0]?.type
          ) &&
          fileList[0]?.size <= 5 * 1024 * 1024),
      {
        message: "Passport photo must be JPG/PNG/WebP and ≤ 5MB",
      }
    ),
});

export type MemberFormValues = z.infer<typeof MemberSchema>;

export default function MemberForm({
  initial,
  onSubmit,
  submitting,
  levels,
}: {
  initial?: Partial<Member> & { passportPictureUrl?: string | null };
  submitting?: boolean;
  onSubmit: (values: MemberFormValues) => void;
  levels?: Level[]; // optional to render a Select for membership levels
}) {
  const form = useForm<MemberFormValues>({
    resolver: zodResolver(MemberSchema),
    defaultValues: {
      firstName: initial?.firstName ?? "",
      lastName: initial?.lastName ?? "",
      email: initial?.email ?? "",
      phone: initial?.phone ?? "",
      level: (initial?.level as string) ?? "",
      status: (initial?.status as MemberStatus) ?? "PROSPECT",
      residentialAddress: initial?.residentialAddress ?? "",
      occupation: initial?.occupation ?? "",
      nationality: initial?.nationality ?? "",
      passportPicture: undefined,
    },
  });

  // Preview for new uploads or existing URL
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initial?.passportPictureUrl ?? null
  );

  useEffect(() => {
    form.reset({
      firstName: initial?.firstName ?? "",
      lastName: initial?.lastName ?? "",
      email: initial?.email ?? "",
      phone: initial?.phone ?? "",
      level: (initial?.level as string) ?? "",
      status: (initial?.status as MemberStatus) ?? "PROSPECT",
      residentialAddress: initial?.residentialAddress ?? "",
      occupation: initial?.occupation ?? "",
      nationality: initial?.nationality ?? "",
      passportPicture: undefined,
    });
    setPreviewUrl(initial?.passportPictureUrl ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    form.setValue("passportPicture", e.target.files, {
      shouldDirty: true,
      shouldValidate: true,
    });
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(initial?.passportPictureUrl ?? null);
    }
  };

  return (
    <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
      {/* Basic info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>First name</Label>
          <Input {...form.register("firstName")} />
          {form.formState.errors.firstName && (
            <p className="text-xs text-red-600">
              {form.formState.errors.firstName.message}
            </p>
          )}
        </div>
        <div>
          <Label>Last name</Label>
          <Input {...form.register("lastName")} />
          {form.formState.errors.lastName && (
            <p className="text-xs text-red-600">
              {form.formState.errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Email</Label>
          <Input type="email" {...form.register("email")} />
          {form.formState.errors.email && (
            <p className="text-xs text-red-600">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
        <div>
          <Label>Phone</Label>
          <Input {...form.register("phone")} />
        </div>
      </div>

      {/* New fields */}
      <div>
        <Label>Residential Address</Label>
        <Textarea rows={3} {...form.register("residentialAddress")} />
        {form.formState.errors.residentialAddress && (
          <p className="text-xs text-red-600">
            {form.formState.errors.residentialAddress.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>Occupation</Label>
          <Input
            {...form.register("occupation")}
            placeholder="e.g., Accountant"
          />
        </div>
        <div>
          <Label>Nationality</Label>
          <Input
            {...form.register("nationality")}
            placeholder="e.g., Ghanaian"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Status */}
        <div>
          <Label>Status</Label>
          <Select
            value={form.watch("status")}
            onValueChange={(v) => form.setValue("status", v as MemberStatus)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PROSPECT">PROSPECT</SelectItem>
              <SelectItem value="PENDING">PENDING</SelectItem>
              <SelectItem value="ACTIVE">ACTIVE</SelectItem>
              <SelectItem value="SUSPENDED">SUSPENDED</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Membership Level */}
        <div>
          <Label>Membership Level</Label>
          {levels && levels.length > 0 ? (
            <Select
              value={form.watch("level") ?? ""}
              onValueChange={(v) =>
                form.setValue("level", v, { shouldDirty: true })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select membership level" />
              </SelectTrigger>
              <SelectContent>
                {levels.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              {...form.register("level")}
              placeholder="Enter membership level (e.g., Gold)"
            />
          )}
        </div>
      </div>

      {/* Passport Picture */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
        <div>
          <Label>Passport Picture</Label>
          <Input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
          />
          {form.formState.errors.passportPicture && (
            <p className="text-xs text-red-600">
              {form.formState.errors.passportPicture.message as string}
            </p>
          )}
          <p className="text-[11px] text-muted-foreground mt-1">
            Accepted: JPG/PNG/WebP, up to 5MB.
          </p>
        </div>
        {previewUrl && (
          <div className="justify-self-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={previewUrl}
              alt="Passport preview"
              className="h-20 w-20 rounded object-cover border"
            />
          </div>
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
