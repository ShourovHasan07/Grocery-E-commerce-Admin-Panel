"use client";

// React Imports
import { useState, useMemo, useEffect, useCallback, useRef } from "react";

// Next Imports
import Link from "next/link";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

// Util Imports
import { toast } from "react-toastify";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import TablePagination from "@mui/material/TablePagination";
import MenuItem from "@mui/material/MenuItem";

// Third-party Imports
import classnames from "classnames";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";

import { formattedDate } from "@/utils/formatters";
import { useAbility, useAbilityLoading } from '@/contexts/AbilityContext';

// Component Imports
import TableFilters from "./TableFilters";
import TablePaginationComponent from "@components/TablePaginationServer";
import CustomTextField from "@core/components/mui/TextField";
import CustomAvatar from "@core/components/mui/Avatar";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";
import LoaderIcon from "@/components/common/Loader";
import LayoutLoader from "@/components/common/LayoutLoader";

// Util Imports
import { getInitials } from "@/utils/getInitials";
import { activeStatusColor, activeStatusLabel } from "@/utils/helpers";

// Style Imports
import tableStyles from "@core/styles/table.module.css";
import pageApiHelper from "@/utils/pageApiHelper";
import ProtectedRouteURL from "@/components/casl/ProtectedRoute";

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
  const isAbilityLoading = useAbilityLoading();
  const router = useRouter();

  // Session
  const { data: session } = useSession();
  const token = session?.accessToken;
  const abortControllerRef = useRef(null);

  // States for data
  const [data, setData] = useState([]);
  // Pagination state
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [paginationMeta, setPaginationMeta] = useState({
    totalCount: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    role: "",
  });

  // Debounced search value
  const debouncedSearch = useDebounce(filters.search, 500);

  // Sorting state
  const [sorting, setSorting] = useState([]);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(true);

  // Loader state for actions
  const [loadingId, setLoadingId] = useState(null);

  const [dialogOpen, setDialogOpen] = useState({
    open: false,
    id: null,
  });

  // Build query params for API
  const buildQueryParams = useCallback(() => {
    const params = {
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
    };

    // Add search filter
    if (debouncedSearch) {
      params.search = debouncedSearch;
    }

    // Add status filter
    if (filters.status && filters.status !== "all") {
      params.status = filters.status;
    }

    // Add role filter
    if (filters.role) {
      params.roleId = filters.role;
    }

    // Add sorting
    if (sorting.length > 0) {
      params.sortBy = sorting[0].id;
      params.sortOrder = sorting[0].desc ? "DESC" : "ASC";
    }

    return params;
  }, [
    pagination.pageIndex,
    pagination.pageSize,
    debouncedSearch,
    filters.status,
    filters.role,
    sorting,
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
        "admins",
        queryParams,
        token,
        {},
        abortControllerRef.current.signal
      );

      if (result.success) {
        const adminsData = result.data?.data?.admins || [];
        const paginationData = result.data?.data?.pagination || {};

        setData(adminsData);
        setPaginationMeta({
          totalCount: paginationData.totalCount || 0,
          totalPages: paginationData.totalPages || 0,
          hasNextPage: paginationData.hasNextPage || false,
          hasPreviousPage: paginationData.hasPreviousPage || false,
        });
      } else if (result.status === 499) {
        // Request was cancelled - ignore silently
        return;
      }
    } catch (err) {
      // console.error("Error fetching admins:", err);
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

  // Reset to first page when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [debouncedSearch, filters.status, filters.role]);

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
            {ability.can('update', 'Admin') && (
              <>
                <IconButton
                  onClick={() => {
                    const path = `/admins/${row.original.id}/edit`;
                    setLoadingId(`edit-${row.original.id}`);
                    router.push(path);
                  }}
                >
                  {loadingId === `edit-${row.original.id}` ? (
                    <LoaderIcon size={17} topColor="border-t-yellow-500" />
                  ) : (
                    <i className="tabler-edit text-textPrimary" />
                  )}
                </IconButton>

                {/* Reset Password */}
                <IconButton
                  onClick={() => {
                    const path = `/admins/${row.original.id}/reset-password`;
                    setLoadingId(`reset-${row.original.id}`);
                    router.push(path);
                  }}
                >
                  {loadingId === `reset-${row.original.id}` ? (
                    <LoaderIcon size={17} topColor="border-t-violet-500" />
                  ) : (
                    <i className="tabler-lock-password" />
                  )}
                </IconButton>
              </>
            )}

            {ability.can('delete', 'Admin') && (
              <IconButton
                onClick={() =>
                  setDialogOpen((prevState) => ({
                    ...prevState,
                    open: !prevState.open,
                    id: row.original.id,
                  }))
                }
              >
                <i className="tabler-trash text-error" />
              </IconButton>
            )}
          </div>
        ),
        enableSorting: false,
      }),
      columnHelper.accessor("id", {
        header: "ID",
        cell: ({ row }) => <Typography>{row.original.id}</Typography>,
      }),
      columnHelper.accessor("name", {
        header: "Name",
        cell: ({ row }) => <Typography>{row.original.name}</Typography>,
      }),
      columnHelper.accessor("email", {
        header: "Email",
        cell: ({ row }) => <Typography>{row.original.email}</Typography>,
      }),
      columnHelper.accessor("phone", {
        header: "Phone",
        cell: ({ row }) => <Typography>{row.original.phone}</Typography>,
      }),
      columnHelper.accessor("role.displayName", {
        header: "Role",
        cell: ({ row }) => (
          <Typography>{row.original?.role?.displayName}</Typography>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => (
          <div className="flex items-center gap-3 text-center">
            <Chip
              variant="tonal"
              label={activeStatusLabel(row.original.status)}
              size="small"
              color={activeStatusColor(row.original.status)}
              className="capitalize"
            />
          </div>
        ),
      }),
      columnHelper.accessor("createdAt", {
        header: "Created At",
        cell: ({ row }) => (
          <Typography>{formattedDate(row.original.createdAt)}</Typography>
        ),
      }),
      columnHelper.accessor("updatedAt", {
        header: "Updated At",
        cell: ({ row }) => (
          <Typography>{formattedDate(row.original.updatedAt)}</Typography>
        ),
      }),
    ],
    [ability, loadingId, router]
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    // Server-side pagination
    manualPagination: true,
    manualSorting: true,
    pageCount: paginationMeta.totalPages,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const getAvatar = (params) => {
    const { avatar, fullName } = params;

    if (avatar) {
      return <CustomAvatar src={avatar} size={34} />;
    } else {
      return <CustomAvatar size={34}>{getInitials(fullName)}</CustomAvatar>;
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const deleteEndpoint = `admins/${itemId}`;

      // call the delete API
      const res = await pageApiHelper.delete(deleteEndpoint, token);

      // Update the data state after successful deletion
      if (res?.success && res?.data?.success) {
        setData((prevData) => prevData.filter((item) => item.id !== itemId));
        setDialogOpen((prevState) => ({
          ...prevState,
          open: !prevState.open,
        }));

        toast.success("Deleted  successfully");
        // Refresh data after deletion
        fetchData();
      }
    } catch (error) {
      // console.error('Delete failed:', error);
      // Show error in toast
      toast.error(error.message);
    }
  };

  return (
    <>
      <ProtectedRouteURL actions={['read', 'update', 'create', 'delete']} subject="Admin">

        {isAbilityLoading ? (
          <LayoutLoader />
        ) : (
          <div>
            <Card>
              <CardHeader title="Admin List" className="pbe-4" />
              <TableFilters filters={filters} onFiltersChange={handleFiltersChange} />
              <div className="flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4">
                <CustomTextField
                  select
                  value={pagination.pageSize}
                  onChange={(e) =>
                    setPagination((prev) => ({
                      ...prev,
                      pageSize: Number(e.target.value),
                      pageIndex: 0,
                    }))
                  }
                  className="max-sm:is-full sm:is-[70px]"
                >
                  <MenuItem value="10">10</MenuItem>
                  <MenuItem value="25">25</MenuItem>
                  <MenuItem value="50">50</MenuItem>
                  <MenuItem value="100">100</MenuItem>
                </CustomTextField>
                <div className="flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4">
                  {ability.can('create', 'Admin') && (<Button
                    variant="contained"
                    component={Link}
                    startIcon={<i className="tabler-plus" />}
                    href={"admins/create"}
                    className="max-sm:is-full"
                  >
                    Add New Admin
                  </Button>)}
                </div>
              </div>
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
                                    header.getContext(),
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
                                  cell.getContext(),
                                )}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  )}
                </table>
              </div>
              <TablePagination
                component={() => (
                  <TablePaginationComponent
                    table={table}
                    totalCount={paginationMeta.totalCount}
                  />
                )}
                count={paginationMeta.totalCount}
                rowsPerPage={pagination.pageSize}
                page={pagination.pageIndex}
                onPageChange={(_, page) => {
                  setPagination((prev) => ({ ...prev, pageIndex: page }));
                }}
                onRowsPerPageChange={(e) => {
                  setPagination({
                    pageIndex: 0,
                    pageSize: Number(e.target.value),
                  });
                }}
              />
            </Card>

            <ConfirmDialog
              dialogData={dialogOpen}
              handleCloseDialog={() =>
                setDialogOpen((prevState) => ({
                  ...prevState,
                  open: !prevState.open,
                  id: null,
                }))
              }
              handleDelete={() => {
                handleDelete(dialogOpen.id);
              }}
            />
          </div>
        )}

      </ProtectedRouteURL>

    </>
  );
};

export default ListTable;
