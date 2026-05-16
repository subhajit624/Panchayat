export const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const buildPagination = (query) => {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 50);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

export const paginatedResponse = (items, total, page, limit) => ({
  items,
  pagination: {
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
    limit,
  },
});
