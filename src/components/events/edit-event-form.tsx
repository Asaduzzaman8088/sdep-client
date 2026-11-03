"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  X,
} from "lucide-react";
import { toast } from "sonner";

import type { EventItem } from "@/types";
import { eventTypes } from "@/lib/site";
import {
  updateEventSchema,
  toDateTimeLocalValue,
  type UpdateEventValues,
} from "@/lib/validators";

interface EditEventFormProps {
  event: EventItem;
  isSubmitting: boolean;
  onSubmit: (values: UpdateEventValues) => void;
  onCancel: () => void;
}

export function EditEventForm({
  event,
  isSubmitting,
  onSubmit,
  onCancel,
}: EditEventFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateEventValues, unknown, UpdateEventValues>({
    resolver: zodResolver(updateEventSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      eventType: event.eventType as UpdateEventValues["eventType"],
      thumbnail: event.thumbnail,
      location: event.location,
      eventDate: toDateTimeLocalValue(event.eventDate),
      capacity: event.capacity,
    },
  });

  const onValid = (values: UpdateEventValues) => {
    onSubmit(values);
  };

  const onInvalid = () => {
    toast.error("Please fix the highlighted fields before saving.");
  };

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)} className="space-y-4">
      <div className="flex items-center justify-between border-b border-base-200 pb-3">
        <h3 className="text-lg font-bold text-base-content">
          Update Event Details
        </h3>
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost btn-circle btn-xs"
        >
          <X className="size-4" />
        </button>
      </div>

      {/* Title */}
      <div>
        <label className="block text-xs font-bold mb-1">Title *</label>
        <input
          type="text"
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
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold mb-1">Type *</label>
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
          <label className="block text-xs font-bold mb-1">Capacity *</label>
          <input
            type="number"
            min="1"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold mb-1">Location *</label>
          <input
            type="text"
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
          <label className="block text-xs font-bold mb-1">
            Event Date &amp; Time (Future date only) *
          </label>
          <input
            type="datetime-local"
            min={toDateTimeLocalValue(new Date())}
            className={`input input-bordered w-full text-sm ${
              errors.eventDate ? "input-error" : ""
            }`}
            {...register("eventDate")}
          />
          {errors.eventDate && (
            <p className="mt-1 text-xs text-error">
              {errors.eventDate.message}
            </p>
          )}
        </div>
      </div>

      {/* Thumbnail URL */}
      <div>
        <label className="block text-xs font-bold mb-1">
          Thumbnail Image URL *
        </label>
        <input
          type="text"
          placeholder="https://images.unsplash.com/..."
          className={`input input-bordered w-full text-sm ${
            errors.thumbnail ? "input-error" : ""
          }`}
          {...register("thumbnail")}
        />
        {errors.thumbnail ? (
          <p className="mt-1 text-xs text-error">{errors.thumbnail.message}</p>
        ) : (
          <div className="mt-2 flex items-center gap-2">
            <Image
              src={event.thumbnail}
              alt=""
              width={56}
              height={32}
              unoptimized
              className="h-8 w-14 rounded object-cover border border-base-300"
            />
            <span className="text-[0.7rem] text-base-content/50">
              Direct image link (http/https) is required.
            </span>
          </div>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-bold mb-1">Description *</label>
        <textarea
          rows={4}
          className={`textarea textarea-bordered w-full text-sm ${
            errors.description ? "textarea-error" : ""
          }`}
          {...register("description")}
        />
        {errors.description && (
          <p className="mt-1 text-xs text-error">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-3 border-t border-base-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-ghost btn-sm rounded-full"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-primary btn-sm rounded-full px-5 font-bold"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
