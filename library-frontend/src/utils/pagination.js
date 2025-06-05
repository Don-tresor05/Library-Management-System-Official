export const DEFAULT_PAGE_SIZE = 10;
export const DEFAULT_SORT_FIELD = 'id';
export const DEFAULT_SORT_ORDER = 'asc';

export const buildPaginationParams = (page, pageSize, sortField, sortOrder, filters = {}) => {
  return {
    page: page || 1,
    size: pageSize || DEFAULT_PAGE_SIZE,
    sort: `${sortField || DEFAULT_SORT_FIELD},${sortOrder || DEFAULT_SORT_ORDER}`,
    ...filters
  };
};