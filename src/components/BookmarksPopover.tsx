import JobList from "./JobList";
import { forwardRef } from "react";
import { useBookmarksContext } from "../lib/hooks";

const BookmarksPopover = forwardRef<HTMLDivElement>(function (_, ref) {
  const { bookmarkedJobItems, isLoading } = useBookmarksContext();

  return (
    <div ref={ref} className="bookmarks-popover">
      <JobList jobItems={bookmarkedJobItems} isLoading={isLoading} />
    </div>
  );
});

export default BookmarksPopover;
