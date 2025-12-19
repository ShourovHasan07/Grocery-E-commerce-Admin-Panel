"use client";

// React Imports
import { useState, useMemo, useEffect, useCallback, useRef } from "react";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";

import { format } from "date-fns";

import classnames from "classnames";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";

// Third-party Imports
import Tooltip from "@mui/material/Tooltip";

import TableFilters from "./TableFilters";

import LoaderIcon from "@/components/common/Loader";

// Util Imports
import { payableStatusLabel, payableStatusColor } from "@/utils/helpers";

// Style Imports
import tableStyles from "@core/styles/table.module.css";

import { useAbility } from "@/contexts/AbilityContext";
import ProtectedRouteURL from "@/components/casl/ProtectedRoute";

// API Helper
import pageApiHelper from "@/utils/pageApiHelper";

// Column Definitions
const columnHelper = createColumnHelper();

// Debounce hook for search optimization
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ListTable = () => {
  const ability = useAbility();
  const router = useRouter();

  // Session
  const { data: session } = useSession();
  const token = session?.accessToken;
  const abortControllerRef = useRef(null);

  // States for data
  const [data, setData] = useState([]);
  // Pagination state - disabled to show all data
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10000,
  });

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    expert: "all",
    status: "unpaid",
    dateFrom: null,
    dateTo: null,
  });

  // Debounced search value
  const debouncedSearch = useDebounce(filters.search, 500);

  // Sorting state
  const [sorting, setSorting] = useState([]);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);

  // Loader state for actions
  const [loadingId, setLoadingId] = useState(null);

  // Build query params for API
  const buildQueryParams = useCallback(() => {
    const params = {
      page: 1, // Always use page 1 since we're fetching all data
      pageSize: 10000, // Set to a large number to fetch all data
    };

    // Add search filter
    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    // Add expert filter
    if (filters.expert && filters.expert !== "all") {
      params.expertId = filters.expert;
    }

    // Add status filter
    if (filters.status && filters.status !== "all") {
      params.status = filters.status;
    }

    // Add date filters
    if (filters.dateFrom) {
      params.dateFrom = format(filters.dateFrom, "yyyy-MM-dd");
    }

    if (filters.dateTo) {
      params.dateTo = format(filters.dateTo, "yyyy-MM-dd");
    }

    return params;
  }, [
    debouncedSearch,
    filters.expert,
    filters.status,
    filters.dateFrom,
    filters.dateTo
  ]);

  // Fetch data from server
  const fetchData = useCallback(async () => {
    if (!token) {
      setIsLoading(false);
      return;
    }

    // Cancel any previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();

    try {
      setIsLoading(true);
      const queryParams = buildQueryParams();

      const result = await pageApiHelper.get(
        "expert-payouts",
        queryParams,
        token,
        {},
        abortControllerRef.current.signal
      );

      if (result.success) {
        const bookingsData = result.data?.data?.expertPayouts || [];

        setData(bookingsData);
      } else if (result.status === 499) {
        // Request was cancelled - ignore silently
        return;
      }
    } catch (err) {
      // console.error("Error fetching bookings:", err);
    } finally {
      setIsLoading(false);
    }
  }, [token, buildQueryParams]);

  // Fetch data when dependencies change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Reset to first page when filters change (not needed for non-paginated view but kept for consistency)
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearch, filters.status, filters.dateFrom, filters.dateTo]);

  // Handle filter changes from TableFilters component
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const columns = useMemo(
    () => [
      columnHelper.accessor("action", {
        header: "Action",
        cell: ({ row }) => (
          <div className="flex items-center">
            {ability.can("read", "Booking") && (
              <Tooltip title="Expert Detail">
                <IconButton
                  onClick={() => {
                    const path = `/experts/${row.original.expertId}`;
                    setLoadingId(`experts-${row.original.expertId}`);
                    router.push(path);
                  }}
                >
                  {loadingId === `experts-${row.original.expertId}` ? (
                    <LoaderIcon size={17} topColor="border-t-yellow-500" />
                  ) : (
                    <i className="tabler-eye text-secondary" />
                  )}
                </IconButton>
              </Tooltip>
            )}
          </div>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor("expertId", {
        header: "Expert ID",
        cell: ({ row }) => <Typography>{row.original.expertId}</Typography>,
      }),
      columnHelper.accessor("expert.name", {
        header: "Expert Name",
        cell: ({ row }) => <Typography className="text-wrap w-[200px]">{row.original.expert.name}</Typography>,
      }),
      columnHelper.accessor("totalPayableAmount", {
        header: () => (
          <div className="text-center">
            Total Payable Amount
          </div>
        ),
        cell: ({ row }) => (
          <Typography className="text-center">
            {row.original.totalPayableAmount}
          </Typography>
        ),
      }),
      columnHelper.accessor("bookingCount", {
        header: () => (
          <div className="text-center">
            Booking Count
          </div>
        ),
        cell: ({ row }) => (
          <Typography className="text-center">
            {row.original.bookingCount}
          </Typography>
        ),
      }),
      columnHelper.accessor("expertPayableStatus", {
        header: "Payout Status",
        cell: ({ row }) => (
          <Chip
            variant="tonal"
            label={payableStatusLabel(row.original.expertPayableStatus)}
            size="small"
            color={payableStatusColor(row.original.expertPayableStatus)}
            className="capitalize"
          />
        ),
      }),
    ],
    [ability, loadingId, router]
  );

  // Compute totals for footer
  const totals = useMemo(() => {
    return {
      totalPayableAmount: data.reduce(
        (sum, item) => sum + (Number(item.totalPayableAmount) || 0),
        0
      ),
      bookingCount: data.reduce(
        (sum, item) => sum + (Number(item.bookingCount) || 0),
        0
      ),
    };
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    // state: {
    //   sorting,
    //   pagination,
    // },
    // Server-side pagination - disabled but kept for structure
    manualPagination: false,
    manualSorting: false,
    pageCount: -1, // Indicates unknown/unlimited pages
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <ProtectedRouteURL
      actions={["read", "update", "create", "delete"]}
      subject="Booking"
    >
      <Card>
        <CardHeader title="Payout List" className="pbe-4" />
        <TableFilters filters={filters} onFiltersChange={handleFiltersChange} />
        <div className="overflow-x-auto">
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              "flex items-center": header.column.getIsSorted(),
                              "cursor-pointer select-none":
                                header.column.getCanSort(),
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {{
                              asc: <i className="tabler-chevron-up text-xl" />,
                              desc: (
                                <i className="tabler-chevron-down text-xl" />
                              ),
                            }[header.column.getIsSorted()] ?? null}
                          </div>
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {isLoading ? (
              <tbody>
                <tr>
                  <td
                    colSpan={table.getVisibleFlatColumns().length}
                    className="text-center"
                  >
                    <div className="flex justify-center items-center py-8">
                      <LoaderIcon size={24} />
                      <span className="ml-2">Loading...</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : data.length === 0 ? (
              <tbody>
                <tr>
                  <td
                    colSpan={table.getVisibleFlatColumns().length}
                    className="text-center"
                  >
                    No data available
                  </td>
                </tr>
              </tbody>
            ) : (
              <>
                <tbody>
                  {table.getRowModel().rows.map((row) => {
                    return (
                      <tr
                        key={row.id}
                        className={classnames({
                          selected: row.getIsSelected(),
                        })}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan={3} className="font-bold text-start">
                      Total Payable Expert(s): {data.length}
                    </td>
                    <td className="text-center font-bold">
                      {totals.totalPayableAmount.toLocaleString()}
                    </td>
                    <td className="text-center font-bold">
                      {totals.bookingCount.toLocaleString()}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </>
            )}
          </table>
        </div>
      </Card>
    </ProtectedRouteURL>
  );
};

export default ListTable;
