import { useEffect, useState, useCallback } from "react";
import { fetchPeople } from "../services/swapi";
import type { Person } from "../types/swapi";
import Pagination from "../components/Pagination";
import ErrorState from "../components/ErrorState";
import LoadingSpinner from "../components/LoadingSpinner";

import "./Table.css";

const PAGE_SIZE = 10;

function Table() {
  const [people, setPeople] = useState<Person[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalCount, setTotalCount] = useState<number>(0);

  const loadPeople = useCallback(async (page: number, bypassCache = false) => {
    if (bypassCache) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const data = await fetchPeople(page, { bypassCache });
      setPeople(data.results);
      setTotalCount(data.count);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong while fetching data.";
      setError(message);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPeople(currentPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleRetry = () => {
    loadPeople(currentPage);
  };

  const handleForceRefresh = () => {
    loadPeople(currentPage, true);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={handleRetry} />;
  }

  return (
    <div className="table-page">
      <div className="table-container">
        <div className="table-header">
          <h1>Star Wars Characters</h1>
          <button className="refresh-button" onClick={handleForceRefresh} disabled={isRefreshing}>
            {isRefreshing ? "Refreshing..." : "⟳ Refresh"}
          </button>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mass</th>
                <th>Height</th>
                <th>Hair Color</th>
                <th>Skin Color</th>
              </tr>
            </thead>
            <tbody>
              {people.map((person) => (
                <tr key={person.name}>
                  <td data-label="Name">{person.name}</td>
                  <td data-label="Mass">{person.mass}</td>
                  <td data-label="Height">{person.height}</td>
                  <td data-label="Hair Color">{person.hair_color}</td>
                  <td data-label="Skin Color">{person.skin_color}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </div>
  );
}

export default Table;
