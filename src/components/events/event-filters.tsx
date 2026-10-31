"use client";

import { Search, SlidersHorizontal, X } from "lucide-react";
import { eventTypes } from "@/lib/site";

interface EventFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedType: string;
  onTypeChange: (value: string) => void;
  selectedLocation: string;
  onLocationChange: (value: string) => void;
  sortBy: string;
  onSortChange: (value: string) => void;
  totalResults: number;
  onClearFilters: () => void;
}

const LOCATIONS = [
  "All Locations",
  "Mirpur",
  "Mohammadpur",
  "Dhanmondi",
  "Uttara",
  "Farmgate",
  "Old Dhaka",
  "Banani",
  "Sadarghat",
];

export function EventFilters({
  searchQuery,
  onSearchChange,
  selectedType,
  onTypeChange,
  selectedLocation,
  onLocationChange,
  sortBy,
  onSortChange,
  totalResults,
  onClearFilters,
}: EventFiltersProps) {
  const hasActiveFilters = Boolean(
    searchQuery || (selectedType && selectedType !== "All") || (selectedLocation && selectedLocation !== "All Locations")
  );

  return (
    <div className="space-y-4 rounded-3xl border border-base-300/80 bg-base-100 p-5 shadow-sm">
      {/* Top Row: Search input + Location dropdown + Sort */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-base-content/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search events by title, description, or neighborhood..."
            className="input input-bordered w-full pl-10 pr-9 text-sm focus:border-primary focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
              aria-label="Clear search query"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        {/* Location Dropdown */}
        <div className="w-full md:w-52">
          <select
            value={selectedLocation}
            onChange={(e) => onLocationChange(e.target.value)}
            className="select select-bordered w-full text-sm font-medium focus:border-primary focus:outline-none"
            aria-label="Filter by location"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Dropdown */}
        <div className="w-full md:w-48">
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="select select-bordered w-full text-sm font-medium focus:border-primary focus:outline-none"
            aria-label="Sort events by"
          >
            <option value="date-asc">Soonest Date</option>
            <option value="popularity">Most Volunteers</option>
            <option value="newest">Recently Added</option>
          </select>
        </div>
      </div>

      {/* Category Pills Row */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-base-200">
        <span className="mr-1 inline-flex items-center gap-1.5 text-xs font-semibold text-base-content/70">
          <SlidersHorizontal className="size-3.5 text-primary" />
          Categories:
        </span>

        <button
          type="button"
          onClick={() => onTypeChange("All")}
          className={`btn btn-sm rounded-full px-3.5 text-xs font-semibold transition-all ${
            selectedType === "All" || !selectedType
              ? "btn-primary shadow-sm"
              : "btn-ghost border border-base-300 text-base-content/80 hover:bg-base-200"
          }`}
        >
          All Causes
        </button>

        {eventTypes.map((type) => {
          const isActive = selectedType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onTypeChange(type)}
              className={`btn btn-sm rounded-full px-3.5 text-xs font-semibold transition-all ${
                isActive
                  ? "btn-primary shadow-sm"
                  : "btn-ghost border border-base-300 text-base-content/80 hover:bg-base-200"
              }`}
            >
              {type}
            </button>
          );
        })}
      </div>

      {/* Results Bar & Active Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-base-content/70">
        <div className="flex items-center gap-2">
          <span>
            Showing <strong className="text-base-content">{totalResults}</strong> upcoming {totalResults === 1 ? "event" : "events"}
          </span>
          {hasActiveFilters && (
            <span className="badge badge-sm badge-neutral">Filtered</span>
          )}
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearFilters}
            className="btn btn-ghost btn-xs text-xs font-semibold text-error hover:bg-error/10"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}
