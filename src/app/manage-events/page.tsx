"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import {
  Calendar,
  Edit3,
  FolderHeart,
  Lock,
  MapPin,
  PlusCircle,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

import type { EventItem, EventsResponse } from "@/types";
import { authClient } from "@/lib/auth-client";
import { apiRequest } from "@/lib/api";
import { eventTypes } from "@/lib/site";

export default function ManageEventsPage() {
  const queryClient = useQueryClient();
  const { data: session, isPending: authPending } = authClient.useSession();
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Fetch my events
  const { data, isLoading } = useQuery<EventsResponse>({
    queryKey: ["my", "events"],
    queryFn: async () => {
      return apiRequest<EventsResponse>("/api/my/events");
    },
    enabled: Boolean(session?.user),
    staleTime: 30_000,
  });

  const myEvents = data?.events || [];

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/events/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      toast.success("Event deleted successfully.");
      queryClient.invalidateQueries({ queryKey: ["my", "events"] });
      setDeletingId(null);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to delete event.";
      toast.error(msg);
    },
  });

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (updated: Partial<EventItem> & { id: string }) => {
      const { id, ...body } = updated;
      return apiRequest(`/api/events/${id}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
    },
    onSuccess: () => {
      toast.success("Event updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["my", "events"] });
      setEditingEvent(null);
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "Failed to update event.";
      toast.error(msg);
    },
  });

  if (authPending) {
    return (
      <div className="page-shell py-20 flex justify-center items-center">
        <span className="loading loading-spinner loading-lg text-primary" />
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="page-shell py-20 flex flex-col items-center justify-center text-center">
        <div className="size-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mb-5">
          <Lock className="size-8" />
        </div>
        <h1 className="text-3xl font-extrabold text-base-content">
          Sign In to Manage Events
        </h1>
        <p className="mt-3 text-sm text-base-content/70 max-w-md">
          Please sign in to view, update, or remove events you have published.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/login?next=/manage-events" className="btn btn-primary rounded-full px-6">
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
    <div className="page-shell py-12 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="section-kicker">
            <Sparkles className="size-4" aria-hidden />
            My Dashboard
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-base-content mt-2">
            Manage <span className="text-primary">My Events</span>
          </h1>
          <p className="mt-1 text-sm text-base-content/70">
            View, edit, or delete events you have organized.
          </p>
        </div>

        <Link
          href="/create-event"
          className="btn btn-primary rounded-full gap-2 self-start sm:self-auto font-bold shadow-md"
        >
          <PlusCircle className="size-4" />
          Create New Event
        </Link>
      </div>

      {/* Events List */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <span className="loading loading-spinner loading-md text-primary" />
        </div>
      ) : myEvents.length > 0 ? (
        <div className="space-y-4">
          <div className="text-xs font-semibold text-base-content/60">
            You have organized <strong>{myEvents.length}</strong> {myEvents.length === 1 ? "event" : "events"}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myEvents.map((evt) => {
              let dateStr = evt.eventDate;
              try {
                dateStr = format(parseISO(evt.eventDate), "EEE, MMM d, yyyy • h:mm a");
              } catch {
                // keep dateStr
              }

              return (
                <div
                  key={evt.id}
                  className="flex flex-col rounded-3xl border border-base-300/80 bg-base-100 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-[16/10] bg-base-200">
                    <Image
                      src={evt.thumbnail}
                      alt={evt.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 350px"
                      className="size-full object-cover"
                    />
                    <div className="absolute top-3 right-3">
                      <span className="badge badge-primary font-bold shadow-xs">
                        {evt.eventType}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-base-content line-clamp-1">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-base-content/70 mt-1 line-clamp-2">
                      {evt.description}
                    </p>

                    <div className="mt-4 pt-3 border-t border-base-200 space-y-1.5 text-xs text-base-content/75">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="size-3.5 text-primary shrink-0" />
                        <span className="truncate">{evt.location}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="size-3.5 text-primary shrink-0" />
                        <span>{dateStr}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="size-3.5 text-primary shrink-0" />
                        <span>
                          {evt.joinedCount} / {evt.capacity || "∞"} volunteers joined
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4 flex items-center justify-between gap-2 border-t border-base-200">
                      <Link
                        href={`/events/${evt.id}`}
                        className="btn btn-ghost btn-xs text-xs font-semibold"
                      >
                        Preview
                      </Link>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setEditingEvent(evt)}
                          className="btn btn-outline btn-xs rounded-full gap-1"
                        >
                          <Edit3 className="size-3" />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => setDeletingId(evt.id)}
                          className="btn btn-error btn-outline btn-xs rounded-full gap-1"
                        >
                          <Trash2 className="size-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-3xl border border-dashed border-base-300 bg-base-100/50 p-12 text-center flex flex-col items-center">
          <div className="size-16 rounded-3xl bg-base-200 text-base-content/60 flex items-center justify-center mb-4">
            <FolderHeart className="size-8" />
          </div>
          <h3 className="text-xl font-bold text-base-content">
            You haven&apos;t created any events yet
          </h3>
          <p className="mt-2 text-sm text-base-content/70 max-w-sm">
            Ready to lead a cause in your area? Organize a winter clothing drive, cleanup, or medical camp today.
          </p>
          <Link
            href="/create-event"
            className="btn btn-primary rounded-full mt-6 gap-2 font-bold shadow-md"
          >
            <PlusCircle className="size-4" />
            Create Your First Event
          </Link>
        </div>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg rounded-3xl border border-base-300 bg-base-100 p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-base-200 pb-3">
              <h3 className="text-lg font-bold text-base-content">
                Update Event Details
              </h3>
              <button
                type="button"
                onClick={() => setEditingEvent(null)}
                className="btn btn-ghost btn-circle btn-xs"
              >
                <X className="size-4" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const title = (form.elements.namedItem("title") as HTMLInputElement).value;
                const eventType = (form.elements.namedItem("eventType") as HTMLSelectElement).value;
                const location = (form.elements.namedItem("location") as HTMLInputElement).value;
                const capacity = Number((form.elements.namedItem("capacity") as HTMLInputElement).value);
                const description = (form.elements.namedItem("description") as HTMLTextAreaElement).value;

                updateMutation.mutate({
                  id: editingEvent.id,
                  title,
                  eventType,
                  location,
                  capacity,
                  description,
                });
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-xs font-bold mb-1">Title</label>
                <input
                  name="title"
                  defaultValue={editingEvent.title}
                  className="input input-bordered w-full text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold mb-1">Type</label>
                  <select
                    name="eventType"
                    defaultValue={editingEvent.eventType}
                    className="select select-bordered w-full text-sm"
                  >
                    {eventTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold mb-1">Capacity</label>
                  <input
                    name="capacity"
                    type="number"
                    defaultValue={editingEvent.capacity}
                    className="input input-bordered w-full text-sm"
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Location</label>
                <input
                  name="location"
                  defaultValue={editingEvent.location}
                  className="input input-bordered w-full text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">Description</label>
                <textarea
                  name="description"
                  defaultValue={editingEvent.description}
                  rows={4}
                  className="textarea textarea-bordered w-full text-sm"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-base-200">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="btn btn-ghost btn-sm rounded-full"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updateMutation.isPending}
                  className="btn btn-primary btn-sm rounded-full px-5 font-bold"
                >
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-3xl border border-base-300 bg-base-100 p-6 shadow-2xl text-center space-y-4">
            <div className="size-12 rounded-full bg-error/10 text-error flex items-center justify-center mx-auto">
              <Trash2 className="size-6" />
            </div>
            <h3 className="text-lg font-bold text-base-content">
              Delete This Event?
            </h3>
            <p className="text-xs text-base-content/70 leading-relaxed">
              Are you sure you want to delete this event? This action cannot be undone and will remove all attendee registrations.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="btn btn-ghost btn-sm rounded-full"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(deletingId)}
                disabled={deleteMutation.isPending}
                className="btn btn-error btn-sm rounded-full px-5 font-bold text-white"
              >
                {deleteMutation.isPending ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
