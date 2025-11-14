"use client";

// React Imports
import { useState, useMemo } from "react";

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

import classnames from "classnames";

import { rankItem } from "@tanstack/match-sorter-utils";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
} from "@tanstack/react-table";

// Third-party Imports
import Tooltip from "@mui/material/Tooltip";

// Util Imports
import { formattedDate } from "@/utils/formatters";

// Component Imports
import TableFilters from "./TableFilters";
import TablePaginationComponent from "@components/TablePaginationComponent";
import CustomTextField from "@core/components/mui/TextField";
import LoaderIcon from "@/components/common/Loader";

// Util Imports
import {
  activeStatusLabel,
  activeStatusColor,
} from "@/utils/helpers";

// Style Imports
import tableStyles from "@core/styles/table.module.css";
import ProtectedRouteURL from "@/components/casl component/ProtectedRoute";

const fuzzyFilter = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};


// Column Definitions
const columnHelper = createColumnHelper();


const ListTable = ({ tableData }) => {
  // console.log("Table Data:", tableData);

  // States
  const dataObj = tableData?.menus || [];
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState(...[dataObj]);
  const [filteredData, setFilteredData] = useState(data);
  const [globalFilter, setGlobalFilter] = useState("");

  // loader state
  const [loadingId, setLoadingId] = useState(null);
  const router = useRouter();


  //session
  const { data: session } = useSession();
  const token = session?.accessToken;

  const columns = useMemo(
    () => [
      columnHelper.accessor("action", {
        header: "Action",
        cell: ({ row }) => (
          <div className="flex items-center">
            <Tooltip title="Menu Items" arrow placement="top">
              <IconButton
                onClick={() => {
                  const path = `/menus/${row.original.id}/menu-items`;

                  setLoadingId(`menus-${row.original.id}`);
                  router.push(path);
                }}
              >
                {loadingId === `menus-${row.original.id}` ? (
                  <LoaderIcon size={17} topColor="border-t-success-500" />
                ) : (
                  <i className="tabler-apps text-success" />
                )}
              </IconButton>
            </Tooltip>

            {/* Edit */}
            <Tooltip title="Edit" arrow placement="top">
              <IconButton
                onClick={() => {
                  const path = `/menus/${row.original.id}/edit`;

                  setLoadingId(`edit-${row.original.id}`);
                  router.push(path);
                }}
              >
                {loadingId === `edit-${row.original.id}` ? (
                  <LoaderIcon topColor="border-t-primary" />
                ) : (
                  <i className="tabler-edit text-primary" />
                )}
              </IconButton>
            </Tooltip>
          </div>
        ),
        enableSorting: false,
      }),
      {
        header: "ID",
        cell: ({ row }) => <Typography>{row.original.id}</Typography>,
      },
      {
        header: "Title",
        cell: ({ row }) => <Typography>{row.original.title}</Typography>,
      },
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
      {
        header: "Updated At",
        cell: ({ row }) => (
          <Typography>{formattedDate(row.original.updatedAt)}</Typography>
        ),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filteredData, loadingId],
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  return (
    <>


     <ProtectedRouteURL 
  actions={['menu-manage']} 
  subject="Miscellaneous"
>
  





      <Card>
        <CardHeader title="Menu List" className="pbe-4" />
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
            {table.getFilteredRowModel().rows.length === 0 ? (
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
                {table
                  .getRowModel()
                  .rows.slice(0, table.getState().pagination.pageSize)
                  .map((row) => {
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
          component={() => <TablePaginationComponent table={table} />}
          count={table.getFilteredRowModel().rows.length}
          rowsPerPage={table.getState().pagination.pageSize}
          page={table.getState().pagination.pageIndex}
          onPageChange={(_, page) => {
            table.setPageIndex(page);
          }}
        />
      </Card>

      </ProtectedRouteURL>


    </>
  );
};

export default ListTable;
