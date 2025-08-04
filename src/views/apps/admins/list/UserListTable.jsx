"use client";

// React Imports
import { useState, useMemo } from "react";

// Next Imports
import Link from "next/link";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import TablePagination from "@mui/material/TablePagination";
import MenuItem from "@mui/material/MenuItem";

// Third-party Imports
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

// Util Imports
import { formattedDate } from "@/utils/formatters";

// Component Imports
import TableFilters from "./TableFilters";
import TablePaginationComponent from "@components/TablePaginationComponent";
import CustomTextField from "@core/components/mui/TextField";
import CustomAvatar from "@core/components/mui/Avatar";

// Util Imports
import { getInitials } from "@/utils/getInitials";

// Style Imports
import tableStyles from "@core/styles/table.module.css";
import { activeStatusColor, activeStatusLabel } from "@/utils/helpers";
import { useSession } from "next-auth/react";
import ConfirmDialog from "@/components/dialogs/ConfirmDialog";
import { toast } from "react-toastify";
import pageApiHelper from "@/utils/pageApiHelper";

// Styled Components
const Icon = styled("i")({});

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

const UserListTable = ({ tableData }) => {



  //console.log("  admin  UserListTable tableData:", tableData);


  // States

  const dataObj = tableData?.admins || [];
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState(...[dataObj]);
  const [filteredData, setFilteredData] = useState(data);
  const [globalFilter, setGlobalFilter] = useState("");

  const [dialogOpen, setDialogOpen] = useState({
    open: false,
    id: null,
  });

  // Hooks

  const columns = useMemo(
    () => [
      columnHelper.accessor("action", {
        header: "Action",
        cell: ({ row }) => (
          <div className="flex items-center">
            {/* <IconButton>
              <Link href={`/admins/${row.original.id}`} className="flex">
                <i className="tabler-eye text-textSecondary" />
              </Link>
            </IconButton> */}

            <IconButton>
              <Link href={`/admins/${row.original.id}/edit`} className="flex">
                <i className="tabler-edit text-textPrimary" />
              </Link>
            </IconButton>

            <IconButton onClick={() => setDialogOpen((prevState) => ({
              ...prevState,
              open: !prevState.open,
              id: row.original.id,
            }))}
            >
              <i className="tabler-trash text-error" />
            </IconButton>

          </div >
        ),
        enableSorting: false,
      }),
      {
        header: "ID",
        cell: ({ row }) => <Typography>{row.original.id}</Typography>,
      },
      columnHelper.accessor("name", {
        header: "Name",
        cell: ({ row }) => <Typography>{row.original.name}</Typography>,
      }),
      {
        header: "Email",
        cell: ({ row }) => <Typography>{row.original.email}</Typography>,
      },
      // {
      //   header: "Phone",
      //   cell: ({ row }) => <Typography>{row.original.contact}</Typography>,
      // },
      // {
      //   header: "Role",
      //   cell: ({ row }) => <Typography>{row.original.role}</Typography>,
      // },


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
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
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
    const { avatar, fullName } = params;

    if (avatar) {
      return <CustomAvatar src={avatar} size={34} />;
    } else {
      return <CustomAvatar size={34}>{getInitials(fullName)}</CustomAvatar>;
    }
  };





  // Session
  const { data: session } = useSession();
  const token = session?.accessToken;

  const handleDelete = async (itemId) => {
    try {
      const deleteEndpoint = `admins/${itemId}`;

      // call the delete API
      const res = await pageApiHelper.delete(deleteEndpoint, token);
      // Update the data state after successful deletion
      if (res?.success && res?.data?.success) {
        setData(prevData => prevData.filter((item) => item.id !== itemId));
        setFilteredData(prevData => prevData.filter((item) => item.id !== itemId));

        setDialogOpen((prevState) => ({
          ...prevState,
          open: !prevState.open,
        }));

        toast.success("Deleted  successfully");
      }

    } catch (error) {
      // console.error('Delete failed:', error);

      // Show error in toast
      toast.error(error.message)
    }
  };






  return (
    <>
      <Card>
        <CardHeader title="Admin List" className="pbe-4" />
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
              variant="contained"
              component={Link}
              startIcon={<i className="tabler-plus" />}
              href={"admins/create"}
              className="max-sm:is-full"
            >
              Add New Admin
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

      <ConfirmDialog
        dialogData={dialogOpen}
        handleCloseDialog={() => setDialogOpen((prevState) => ({
          ...prevState,
          open: !prevState.open,
          id: null,
        }))}
        handleDelete={() => { handleDelete(dialogOpen.id); }}
      />



    </>
  );
};

export default UserListTable;
