"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Calendar,
  CheckCircle,
  FileText,
  Image as ImageIcon,
  Lock,
  MapPin,
  PlusCircle,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import { eventTypes } from "@/lib/site";

// Ensure date is in the future
const createEventSchema = z.object({
  title: z
    .string()
    .min(5, "Title must be at least 5 characters.")
    .max(120, "Title cannot exceed 120 characters."),
  description: z
    .string()
    .min(20, "Description must be at least 20 characters.")
    .max(5000, "Description cannot exceed 5000 characters."),
  eventType: z.string().min(1, "Please select an event type."),
  thumbnail: z
    .string()
    .url("Please provide a valid image URL (e.g. https://...)."),
  location: z
    .string()
    .min(3, "Location must be at least 3 characters.")
    .max(160, "Location cannot exceed 160 characters."),
  eventDate: z.string().refine(
    (val) => {
      const selected = new Date(val);
      return !isNaN(selected.getTime()) && selected.getTime() > Date.now();
    },
    { message: "Event date must be in the future. Past dates are not allowed." },
  ),
  capacity: z
    .number()
    .int()
    .min(1, "Capacity must be at least 1 volunteer.")
    .max(10000, "Capacity cannot exceed 10,000."),
});

type CreateEventFormValues = z.infer<typeof createEventSchema>;

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Tomorrow's date as min for HTML input
  const [tomorrowStr] = useState(() =>
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateEventFormValues>({
    resolver: zodResolver(createEventSchema),
    defaultValues: {
      eventType: "Donation",
      capacity: 50,
      eventDate: tomorrowStr,
    },
  });

  const onSubmit = async (values: CreateEventFormValues) => {
    if (!session?.user) {
      toast.error("Please sign in to publish a community event.");
      router.push("/login?next=/create-event");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...values,
        eventDate: new Date(values.eventDate).toISOString(),
      };

      await apiRequest("/api/events", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success("Event created successfully!", {
        description: "Your service day has been published to the upcoming events directory.",
      });

      // Redirect to upcoming events per requirements
      router.push("/upcoming-events");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to create event. Please try again.";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="page-shell py-20 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  // Protected route check
  if (!session?.user) {
    return (
      <div className="page-shell py-20 flex flex-col items-center justify-center text-center">
        <div className="size-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-5">
          <Lock className="size-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-base-content">
          Sign In to Create an Event
        </h1>
        <p className="mt-3 text-sm text-base-content/70 max-w-md">
          Only registered and logged-in community members can organize and publish service events on SDEP.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/login?next=/create-event" className="btn btn-primary rounded-full px-6">
            Sign In
          </Link>
          <Link href="/register" className="btn btn-outline rounded-full px-6">
            Create an Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell py-12 max-w-3xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <span className="section-kicker">
          <Sparkles className="size-4" aria-hidden />
          Organizer Dashboard
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-base-content mt-2">
          Create a Community <span className="text-primary">Service Event</span>
        </h1>
        <p className="mt-2 text-sm text-base-content/70">
          Publish a new drive or initiative in your local neighborhood. Gather volunteers and lead the change.
        </p>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-3xl border border-base-300/80 bg-base-100 p-6 sm:p-10 shadow-lg space-y-6"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-bold text-base-content mb-1.5">
            Event Title *
          </label>
          <input
            type="text"
            placeholder="e.g. Winter Clothes Distribution – Mirpur 10, Dhaka"
            className={`input input-bordered w-full text-sm ${
              errors.title ? "input-error" : ""
            }`}
            {...register("title")}
          />
          {errors.title && (
            <p className="mt-1 text-xs text-error">{errors.title.message}</p>
          )}
        </div>

        {/* Event Type & Capacity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-base-content mb-1.5">
              Event Type *
            </label>
            <select
              className={`select select-bordered w-full text-sm ${
                errors.eventType ? "select-error" : ""
              }`}
              {...register("eventType")}
            >
              {eventTypes.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {errors.eventType && (
              <p className="mt-1 text-xs text-error">{errors.eventType.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-base-content mb-1.5 flex items-center gap-1.5">
              <Users className="size-4 text-primary" />
              Volunteer Capacity *
            </label>
            <input
              type="number"
              min="1"
              placeholder="50"
              className={`input input-bordered w-full text-sm ${
                errors.capacity ? "input-error" : ""
              }`}
              {...register("capacity", { valueAsNumber: true })}
            />
            {errors.capacity && (
              <p className="mt-1 text-xs text-error">{errors.capacity.message}</p>
            )}
          </div>
        </div>

        {/* Location & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-bold text-base-content mb-1.5 flex items-center gap-1.5">
              <MapPin className="size-4 text-primary" />
              Location *
            </label>
            <input
              type="text"
              placeholder="e.g. Town Hall, Mohammadpur, Dhaka"
              className={`input input-bordered w-full text-sm ${
                errors.location ? "input-error" : ""
              }`}
              {...register("location")}
            />
            {errors.location && (
              <p className="mt-1 text-xs text-error">{errors.location.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold text-base-content mb-1.5 flex items-center gap-1.5">
              <Calendar className="size-4 text-primary" />
              Event Date & Time (Future date only) *
            </label>
            <input
              type="datetime-local"
              min={tomorrowStr}
              className={`input input-bordered w-full text-sm ${
                errors.eventDate ? "input-error" : ""
              }`}
              {...register("eventDate")}
            />
            {errors.eventDate && (
              <p className="mt-1 text-xs text-error">{errors.eventDate.message}</p>
            )}
          </div>
        </div>

        {/* Thumbnail URL */}
        <div>
          <label className="block text-sm font-bold text-base-content mb-1.5 flex items-center gap-1.5">
            <ImageIcon className="size-4 text-primary" />
            Thumbnail Image URL *
          </label>
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            className={`input input-bordered w-full text-sm ${
              errors.thumbnail ? "input-error" : ""
            }`}
            {...register("thumbnail")}
          />
          {errors.thumbnail ? (
            <p className="mt-1 text-xs text-error">{errors.thumbnail.message}</p>
          ) : (
            <p className="mt-1 text-[0.7rem] text-base-content/50">
              Provide a direct image link (Unsplash, Cloudinary, etc.) showcasing the cause.
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-bold text-base-content mb-1.5 flex items-center gap-1.5">
            <FileText className="size-4 text-primary" />
            Event Description *
          </label>
          <textarea
            rows={5}
            placeholder="Explain the purpose of this drive, what volunteers will do, equipment provided, and where to meet..."
            className={`textarea textarea-bordered w-full text-sm ${
              errors.description ? "textarea-error" : ""
            }`}
            {...register("description")}
          />
          {errors.description && (
            <p className="mt-1 text-xs text-error">{errors.description.message}</p>
          )}
        </div>

        {/* Organizer confirmation tag */}
        <div className="rounded-2xl bg-base-200/60 p-4 flex items-center gap-3 text-xs text-base-content/75">
          <CheckCircle className="size-5 text-primary shrink-0" />
          <span>
            Publishing as: <strong className="text-base-content">{session.user.name}</strong> ({session.user.email}). Your email will be stored with the event data.
          </span>
        </div>

        {/* Submit button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-base-200">
          <Link href="/upcoming-events" className="btn btn-ghost btn-sm rounded-full">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary btn-md rounded-full px-8 font-bold shadow-md gap-2"
          >
            {isSubmitting ? (
              <span className="loading loading-spinner loading-sm" />
            ) : (
              <PlusCircle className="size-4" />
            )}
            Publish Event
          </button>
        </div>
      </form>
    </div>
  );
}
