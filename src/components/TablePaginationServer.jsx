// MUI Imports
import Pagination from "@mui/material/Pagination";
import Typography from "@mui/material/Typography";

const TablePaginationComponent = ({ table, totalCount }) => {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();

  // Calculate display range
  const startRecord = pageIndex * pageSize + 1;
  const endRecord = Math.min((pageIndex + 1) * pageSize, totalCount || 0);

  return (
    <div className="flex justify-between items-center flex-wrap pli-6 border-bs bs-auto plb-[12.5px] gap-2">
      <Typography color="text.disabled" className="text-sm">
        {totalCount > 0
          ? `Showing ${startRecord} to ${endRecord} of ${totalCount} entries`
          : "No entries to show"}
      </Typography>
      <Pagination
        shape="rounded"
        color="primary"
        variant="tonal"
        count={pageCount}
        page={pageIndex + 1}
        onChange={(_, page) => {
          table.setPageIndex(page - 1);
        }}
        showFirstButton
        showLastButton
        disabled={pageCount <= 1}
      />
    </div>
  );
};

export default TablePaginationComponent;
