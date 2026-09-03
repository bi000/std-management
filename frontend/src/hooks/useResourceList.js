import { useState, useEffect, useCallback } from 'react';
import getErrorMessage from '../utils/getErrorMessage';

// Every list page (Students, Departments, Courses, Enrollments, Users)
// needs the same shape of state — rows, pagination, loading, error,
// plus search/sort/filter params — so this hook centralizes that
// instead of re-implementing it five times with five chances to
// diverge in behavior.
function useResourceList(service, { defaultSortBy = '', defaultOrder = 'asc', extraFilters = {} } = {}) {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [params, setParams] = useState({
    page: 1,
    search: '',
    sortBy: defaultSortBy,
    order: defaultOrder,
    ...extraFilters,
  });

  const fetchList = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const { data, pagination: paginationMeta } = await service.getAll(params);
      // If a delete emptied the current page (e.g. removing the last
      // row on page 2 of 2), step back a page instead of showing a
      // false "no results" for data that still exists elsewhere.
      if (data.length === 0 && params.page > 1 && paginationMeta.total > 0) {
        setParams((prev) => ({ ...prev, page: prev.page - 1 }));
        return;
      }
      setRows(data);
      setPagination(paginationMeta);
    } catch (err) {
      setError(getErrorMessage(err, 'Unable to load data. Please try again.'));
    } finally {
      setIsLoading(false);
    }
    // `service` is a stable module-level object, so it's intentionally
    // left out of the dependency list to avoid re-running on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  function setSearch(search) {
    setParams((prev) => ({ ...prev, search, page: 1 }));
  }

  function setPage(page) {
    setParams((prev) => ({ ...prev, page }));
  }

  function setSort(sortBy, order) {
    setParams((prev) => ({ ...prev, sortBy, order }));
  }

  function setFilter(key, value) {
    // Resets to page 1 whenever a filter changes, since the previous
    // page number may no longer exist in the newly filtered results.
    setParams((prev) => ({ ...prev, [key]: value, page: 1 }));
  }

  return { rows, pagination, isLoading, error, params, setSearch, setPage, setSort, setFilter, refetch: fetchList };
}

export default useResourceList;
