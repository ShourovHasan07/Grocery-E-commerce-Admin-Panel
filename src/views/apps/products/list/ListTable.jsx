"use client";

// React Imports
import { useState, useMemo, useEffect, useCallback, useRef } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { useSession } from "next-auth/react";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import TablePagination from "@mui/material/TablePagination";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";

// Third-party Imports
import classnames from "classnames";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
} from "@tanstack/react-table";

import LoaderIcon from "@/components/common/Loader";
import ConfirmDialog from "@components/dialogs/ConfirmDialog";

import {
  activeStatusLabel,
  activeStatusColor,
  popularStatusLabel,
  popularStatusColor,
} from "@/utils/helpers";
import pageApiHelper from "@/utils/pageApiHelper";

// Util Imports
import { formattedDate } from "@/utils/formatters";

// Component Imports
import TableFilters from "./TableFilters";
import TablePaginationComponent from "@components/TablePaginationServer";
import CustomTextField from "@core/components/mui/TextField";
import CustomAvatar from "@core/components/mui/Avatar";

// Util Imports
import { getInitials } from "@/utils/getInitials";

// Style Imports
import tableStyles from "@core/styles/table.module.css";

import { useAbility, useAbilityLoading } from '@/contexts/AbilityContext';
import LayoutLoader from "@/components/common/LayoutLoader";
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
    verified: "",
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

    // Add verified filter
    if (filters.verified && filters.verified !== "all") {
      params.verified = filters.verified;
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
    filters.verified,
    sorting,
  ]);

  // Fetch data from server
  const fetchData = useCallback(async () => {
  if (!token) {
    setIsLoading(false);
    return;
  }

  if (abortControllerRef.current) {
    abortControllerRef.current.abort();
  }

  abortControllerRef.current = new AbortController();

  try {
    setIsLoading(true);

    const res = await fetch("http://localhost:4000/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal: abortControllerRef.current.signal,
    });

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const result = await res.json();
    console.log("Products API Response:", result);

    // 👇 backend অনুযায়ী adjust করো
    setData(result);

setPaginationMeta({
  totalCount: result.length,
  totalPages: Math.ceil(result.length / pagination.pageSize),
  hasNextPage: false,
  hasPreviousPage: false,
});


  } catch (error) {
    if (error.name !== "AbortError") {
      console.error("Fetch error:", error);
    }
  } finally {
    setIsLoading(false);
  }
}, [token]);

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
  }, [debouncedSearch, filters.status]);

  // Handle filter changes from TableFilters component
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const getAvatar = (params) => {
    const { avatar, name } = params;

    if (avatar) {
      return <CustomAvatar src={avatar} size={50} />;
    } else {
      return <CustomAvatar size={50}>{getInitials(name)}</CustomAvatar>;
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const deleteEndpoint = `experts/${itemId}`;

      // call the delete API
      const res = await pageApiHelper.delete(deleteEndpoint, token);

      // Update the data state after successful deletion
      if (res?.success && res?.data?.success) {
        setData((prevData) => prevData.filter((item) => item.id !== itemId));
        setDialogOpen((prevState) => ({
          ...prevState,
          open: !prevState.open,
        }));

        toast.success("Deleted successfully");
        // Refresh data after deletion
        fetchData();
      }
    } catch (error) {
      // console.error('Delete failed:', error);
      // Show error in toast
      toast.error(error.message);
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("action", {
        header: "Action",
        cell: ({ row }) => (
          <div className="text-wrap w-[160px]">
            {/* Detail */}
            {ability?.can('read', 'expert') && (
              <Tooltip title="Detail">
                <IconButton
                  onClick={() => {
                    const path = `/experts/${row.original.id}`;

                    setLoadingId(`detail-${row.original.id}`);
                    router.push(path);
                  }}
                >
                  {loadingId === `detail-${row.original.id}` ? (
                    <LoaderIcon />
                  ) : (
                    <i className="tabler-eye text-secondary" />
                  )}
                </IconButton>
              </Tooltip>
            )}

            {ability?.can('update', 'expert') && (
              <>
                {/* Review Rating */}
                <Tooltip title="Review Rating" arrow placement="top">
                  <IconButton
                    onClick={() => {
                      const path = `/experts/${row.original.id}/reviews`;

                      setLoadingId(`rev-${row.original.id}`);
                      router.push(path);
                    }}
                  >
                    {loadingId === `rev-${row.original.id}` ? (
                      <LoaderIcon topColor="border-t-primary" />
                    ) : (
                      <i className="tabler-brand-revolut text-primary" />
                    )}
                  </IconButton>
                </Tooltip>

               
                
              </>
            )}

            {/* Delete */}
            {ability?.can('delete', 'expert') && (
              <Tooltip title="Delete" arrow placement="top">
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
              </Tooltip>
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
        header: " product  Name",
        cell: ({ row }) => (
          <Typography className="text-wrap w-[200px]">
            {row.original.name}
          </Typography>
        ),
      }),
      columnHelper.accessor("image", {
        header: "Image",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            {getAvatar({
              avatar: row.original.image,
              name: row.original.name,
            })}
          </div>
        ),
      }),
      columnHelper.accessor("category", {
        header: "category",
        cell: ({ row }) => <Typography>{row.original.category}</Typography>,
      }),
      columnHelper.accessor("vendor", {
        header: "vendor",
        cell: ({ row }) => <Typography className="text-wrap w-[100px]">{row.original.vendor}</Typography>,
      }),
      columnHelper.accessor("price", {
        header: "price ",
        cell: ({ row }) => <Typography>{row.original.price}</Typography>,
      }),
      columnHelper.accessor("oldPrice", {
        header: "oldPrice",
        cell: ({ row }) => <Typography className="text-wrap w-[150px]">{row.original.oldPrice}</Typography>,
      }),
      columnHelper.accessor("discount", {
        header: "discount",
        cell: ({ row }) => <Typography className="text-wrap w-[150px]">{row.original.discount}</Typography>,
      }),
      columnHelper.accessor("stock", {
        header: "stock",
        cell: ({ row }) => <Typography className="text-wrap w-[150px]">{row.original.stock}</Typography>,
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

  return (
    <ProtectedRouteURL actions={['read', 'update', 'create', 'delete']} subject="Expert">

      {isAbilityLoading ? (
        <LayoutLoader />
      ) : (
        <>
          <Card>
            <CardHeader title="Expert List" className="pbe-4" />
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
                {ability?.can('create', 'expert') && (
                  <Button
                    variant="contained"
                    component={Link}
                    startIcon={<i className="tabler-plus" />}
                    href={"experts/create"}
                    className="max-sm:is-full"
                  >
                    Add New Expert
                  </Button>
                )}
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
        </>
      )}
    </ProtectedRouteURL>
  );
};

export default ListTable;
