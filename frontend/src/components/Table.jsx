// `columns` is [{ key, label, sortable }]. `row[key]` renders directly
// unless a matching `render` function is supplied, which covers
// custom cells (status badges, action buttons) without needing a
// different table component for every page.
function Table({ columns, rows, sortBy, order, onSort, rowKey = 'id', renderActions }) {
  function handleHeaderClick(column) {
    if (!column.sortable || !onSort) return;
    const nextOrder = sortBy === column.key && order === 'asc' ? 'desc' : 'asc';
    onSort(column.key, nextOrder);
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-ink-100 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-ink-100 bg-ink-50/60">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => handleHeaderClick(column)}
                className={`px-4 py-3 font-medium text-ink-600 ${column.sortable ? 'cursor-pointer select-none hover:text-ink-900' : ''}`}
              >
                <span className="inline-flex items-center gap-1">
                  {column.label}
                  {column.sortable && sortBy === column.key && (
                    <span aria-hidden="true">{order === 'asc' ? '↑' : '↓'}</span>
                  )}
                </span>
              </th>
            ))}
            {renderActions && <th className="px-4 py-3 text-right font-medium text-ink-600">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {rows.map((row) => (
            <tr key={row[rowKey]} className="hover:bg-ink-50/40">
              {columns.map((column) => (
                <td key={column.key} className="px-4 py-3 text-ink-800">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
              {renderActions && <td className="px-4 py-3 text-right">{renderActions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
