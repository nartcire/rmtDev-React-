import Header, { HeaderTop } from "./Header";
import { PageDirection, SortBy } from "../lib/types";
import Sidebar, { SidebarTop } from "./Sidebar";
import { useDebounce, useJobItems } from "../lib/hooks";

import Background from "./Background";
import BookmarksButton from "./BookmarksButton";
import Container from "./Container";
import Footer from "./Footer";
import JobItemContent from "./JobItemContent";
import JobList from "./JobList";
import Logo from "./Logo";
import PaginationControls from "./PaginationControls";
import { RESULTS_PER_PAGE } from "../lib/constants";
import ResultsCount from "./ResultsCount";
import SearchForm from "./SearchForm";
import SortingControls from "./SortingControls";
import { Toaster } from "react-hot-toast";
import { useState } from "react";

function App() {
  // State
  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebounce(searchText, 250);
  const { jobItems, isLoading } = useJobItems(debouncedSearchText);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortBy>("relevant");

  // Derived / Computed State
  const totalNumberOfResults = jobItems?.length || 0;
  const totalNumberOfPages = totalNumberOfResults / RESULTS_PER_PAGE;
  const jobItemsSorted =
    [...(jobItems || [])]?.sort((a, b) => {
      if (sortBy === "relevant") {
        return b.relevanceScore - a.relevanceScore;
      } else {
        return a.daysAgo - b.daysAgo;
      }
    }) || [];
  const jobItemsSortedAndSliced = jobItemsSorted.slice(
    currentPage * RESULTS_PER_PAGE - RESULTS_PER_PAGE,
    currentPage * RESULTS_PER_PAGE
  );

  // Event Handlers / Actions
  const handleChangePage = (direction: PageDirection) => {
    if (direction === "next") {
      setCurrentPage((prev) => prev + 1);
    } else if (direction === "previous") {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleChangeSortBy = (newSortBy: SortBy) => {
    setCurrentPage(1);
    setSortBy(newSortBy);
  };

  return (
    <>
      <Background />
      <Header>
        <HeaderTop>
          <Logo />
          <BookmarksButton />
        </HeaderTop>
        <SearchForm searchText={searchText} setSearchText={setSearchText} />
      </Header>
      <Container>
        <Sidebar>
          <SidebarTop>
            <ResultsCount totalNumberOfResults={totalNumberOfResults} />
            <SortingControls sortBy={sortBy} onClick={handleChangeSortBy} />
          </SidebarTop>

          <JobList jobItems={jobItemsSortedAndSliced} isLoading={isLoading} />

          <PaginationControls
            totalNumberOfPages={totalNumberOfPages}
            currentPage={currentPage}
            onClick={handleChangePage}
          />
        </Sidebar>
        <JobItemContent />
      </Container>
      <Footer />

      <Toaster position="top-right" />
    </>
  );
}

export default App;
