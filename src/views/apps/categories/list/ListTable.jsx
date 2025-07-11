"use client";

// React Imports
import { useState, useMemo, useEffect } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import TablePagination from "@mui/material/TablePagination";
import MenuItem from "@mui/material/MenuItem";

import { toast } from "react-toastify";

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

import CustomAvatar from "@core/components/mui/Avatar";// Util Imports
import { getInitials } from "@/utils/getInitials";
import ConfirmDialog from "@components/dialogs/ConfirmDialog";
import AddDrawer from './AddDrawer'


// Third-party Imports

import apiHelper from "@/utils/apiHelper";
import shourovApiHelper from "@/utils/shourovApiHelper";

// Util Imports
import { formattedDate } from "@/utils/formatters";

// Component Imports
import TableFilters from "./TableFilters";
import TablePaginationComponent from "@components/TablePaginationComponent";
import CustomTextField from "@core/components/mui/TextField";

// Util Imports
import { activeStatusLabel, activeStatusColor, popularStatusLabel, popularStatusColor } from "@/utils/helpers";

// Style Imports
import tableStyles from "@core/styles/table.module.css";
import { useSession } from "next-auth/react";


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

const ListTable = () => {
  // States
  //const dataObj = tableData?.categories || [];
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [dialogOpen, setDialogOpen] = useState({
    open: false,
    data: {},
  });

  const [addDrawerOpen, setAddDrawerOpen] = useState({
    open: false,
    type: "create",
    data: {},
  });

  // console.log("Data: ", addDrawerOpen.open);

   const { data: session } = useSession();

    useEffect(() => {
    const fetchCategories = async () => {
     
      const result = await shourovApiHelper.get("/api/category", {}, session);

      console.log(result)

      if (result.success) {
  setData(result.data?.data?.categories || []);

      } else {
        console.error("Error:", result.error);
      }
    };

    if (session) {
      fetchCategories();
    }
  }, [session]);//  session dependency




  // call the delete API

  const handleDelete = async (itemId) => {
  try {
    // Show loading state in dialog
    setDialogOpen(prev => ({ ...prev, isLoading: true }));

    // Make DELETE request (not GET as in your original code)
    const res = await shourovApiHelper.delete(`/api/category/${itemId}`, null, session);

    if (res?.success) {
      // Update local state
      setData(prev => prev.filter(item => item.id !== itemId));
      setFilteredData(prev => prev.filter(item => item.id !== itemId));

      // Close dialog and reset
      setDialogOpen({
        open: false,
        data: {},
        isLoading: false
      });

      // Show success message
      toast.success(res?.data?.message || "Category deleted successfully");
    } else {
      throw new Error(res?.error?.message || 'Failed to delete category');
    }
  } catch (error) {
    console.error('Delete failed:', error);
    
    // Reset loading state
    setDialogOpen(prev => ({ ...prev, isLoading: false }));
    
    // Show error message
    toast.error(error.message || 'An error occurred during deletion');
  }
};
  const columns = useMemo(
    () => [
      columnHelper.accessor("action", {
        header: "Action",
        cell: ({ row }) => (
          <div className="flex items-center">
            <IconButton
              onClick={() => setAddDrawerOpen((prevState) => ({
                ...prevState,
                open: !prevState.open,
                type: "edit",
                data: row.original
              }))}
            >
              <i className="tabler-edit text-textPrimary" />
            </IconButton>

            <IconButton onClick={() => setDialogOpen((prevState) => ({
              ...prevState,
              open: !prevState.open,
              data: row.original
            }))}>
              <i className="tabler-trash text-textSecondary" />
            </IconButton>
          </div>
        ),
        enableSorting: false,
      }),
      {
        header: "ID",
        cell: ({ row }) => <Typography>{row.original.id}</Typography>,
      },
      {
        header: "Name",
        cell: ({ row }) => <Typography>{row.original.name}</Typography>,
      },
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
      columnHelper.accessor("isPopular", {
        header: "Is Popular",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Chip
              variant="tonal"
              label={popularStatusLabel(row.original.isPopular)}
              size="small"
              color={popularStatusColor(row.original.isPopular)}
              className="capitalize"
            />
          </div>
        ),
      }),
      columnHelper.accessor("status", {
        header: "Status",
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
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
    [data, filteredData],
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

  const getAvatar = (params) => {
    const { avatar, name } = params;

    if (avatar) {
      return <CustomAvatar src={avatar} size={50} />;
    } else {
      return <CustomAvatar size={50}>{getInitials(name)}</CustomAvatar>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader title="Category List" className="pbe-4" />
        <TableFilters setData={setFilteredData} tableData={data} />
        <div className="flex justify-between flex-col items-start md:flex-row md:items-center p-6 border-bs gap-4">
          <CustomTextField
            select
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="max-sm:is-full sm:is-[70px]"
          >
            <MenuItem value="10">10</MenuItem>
            <MenuItem value="25">25</MenuItem>
            <MenuItem value="50">50</MenuItem>
          </CustomTextField>
          <div className="flex flex-col sm:flex-row max-sm:is-full items-start sm:items-center gap-4">
            <Button
              variant='contained'
              startIcon={<i className='tabler-plus' />}
              onClick={() => setAddDrawerOpen((prevState) => ({
                ...prevState,
                open: !prevState.open,
                type: "create",
                data: {}
              }))}
              className='max-sm:is-full'
            >
              Add New Category
            </Button>
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
      <AddDrawer
        drawerData={addDrawerOpen}
        handleClose={() => setAddDrawerOpen((prevState) => ({
          ...prevState,
          open: !prevState.open,
          type: prevState.type,
          data: {},
        }))}
        userData={data}
        setData={setData}
        setType={addDrawerOpen.type}
      />

      <ConfirmDialog
        dialogData={dialogOpen}
        handleCloseDialog={() => setDialogOpen((prevState) => ({
          ...prevState,
          open: !prevState.open,
          data: {},
        }))}
        handleDelete={() => { handleDelete(dialogOpen.data.id); }}
      />
    </>
  );
};

export default ListTable;
