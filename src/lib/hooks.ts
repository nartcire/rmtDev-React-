import { JobItem, JobItemExpanded } from "./types";
import { useContext, useEffect, useState } from "react";

import { BASE_API_URL } from "./constants";
import { BookmarksContext } from "../contexts/BookmarksContextProvider";
import { handleError } from "./utils";
import { useQuery } from "@tanstack/react-query";

// ---------------------------------------------------------------------------- //

type JobItemsApiResponse = {
  public: boolean;
  sorted: boolean;
  jobItems: JobItem[];
};

const fetchJobItems = async (
  searchText: string
): Promise<JobItemsApiResponse> => {
  const response = await fetch(`${BASE_API_URL}?search=${searchText}`);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.description);
  }

  const data = await response.json();
  return data;
};

export function useJobItems(searchText: string) {
  const { data, isInitialLoading } = useQuery(
    ["job-items", searchText],
    () => fetchJobItems(searchText),
    {
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(searchText),
      onError: handleError,
    }
  );

  const jobItems = data?.jobItems;
  const isLoading = isInitialLoading;
  return { jobItems, isLoading } as const;
}
// ---------------------------------------------------------------------------- //

export function useActiveId() {
  const [activeId, setActiveId] = useState<number | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const id = +window.location.hash.slice(1);
      setActiveId(id);
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return activeId;
}

// ---------------------------------------------------------------------------- //

type JobItemApiResponse = {
  public: boolean;
  jobItem: JobItemExpanded;
};

// ---------------------------------------------------------------------------- //

const fetchJobItem = async (id: number): Promise<JobItemApiResponse> => {
  const response = await fetch(`${BASE_API_URL}/${id}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.description);
  }

  return data;
};

// ---------------------------------------------------------------------------- //

export function useJobItem(id: number | null) {
  const { data, isInitialLoading } = useQuery(
    ["job-item", id],
    () => (id ? fetchJobItem(id) : null),
    {
      staleTime: 1000 * 60 * 60,
      refetchOnWindowFocus: false,
      retry: false,
      enabled: Boolean(id),
      onError: handleError,
    }
  );

  const jobItem = data?.jobItem;
  const isLoading = isInitialLoading;
  return {
    jobItem,
    isLoading,
  } as const;
}

// ---------------------------------------------------------------------------- //

export function useDebounce<T>(value: T, delay = 500): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);

      return () => clearTimeout(timerId);
    }, delay);
  }, [value, delay]);

  return debouncedValue;
}

// ---------------------------------------------------------------------------- //

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState(() =>
    JSON.parse(localStorage.getItem(key) || JSON.stringify(initialValue))
  );

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [value, key]);

  return [value, setValue] as const;
}

// ---------------------------------------------------------------------------- //

export function useBookmarksContext() {
  const context = useContext(BookmarksContext);

  if (!context) {
    throw new Error(
      "useContext(BookmarksContext) must be used within a BookmarksContextProvider"
    );
  }

  return context;
}
