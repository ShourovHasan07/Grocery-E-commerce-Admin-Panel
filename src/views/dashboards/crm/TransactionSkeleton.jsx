"use client";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Skeleton from "@mui/material/Skeleton";

import tableStyles from "@core/styles/table.module.css";

const TransactionSkeleton = ({ title }) => {
  return (
    <Card>
      <CardHeader
        title={title}
      />
      <div className="overflow-x-auto">
        <table className={tableStyles.table}>
          <thead className="uppercase">
            <tr className="border-be">
              <th className="leading-6 plb-4 pis-6 pli-2">Card</th>
              <th className="leading-6 plb-4 pli-2">Date</th>
              <th className="leading-6 plb-4 pli-2">Status</th>
              <th className="leading-6 plb-4 pie-6 pli-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className="border-0">
                <td className="pis-6 pli-2 plb-3">
                  <div className="flex items-center gap-4">
                    <Skeleton variant="rectangular" width={50} height={30} className="rounded" />
                    <div className="flex flex-col">
                      <Skeleton variant="text" width={60} height={20} />
                    </div>
                  </div>
                </td>
                <td className="pli-2 plb-3">
                  <div className="flex flex-col gap-1">
                    <Skeleton variant="text" width={120} height={16} />
                    <Skeleton variant="text" width={80} height={14} />
                  </div>
                </td>
                <td className="pli-2 plb-3">
                  <Skeleton variant="rounded" width={60} height={24} />
                </td>
                <td className="pli-2 plb-3 pie-6 text-right">
                  <Skeleton className="ms-auto" variant="text" width={70} height={20} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default TransactionSkeleton;
