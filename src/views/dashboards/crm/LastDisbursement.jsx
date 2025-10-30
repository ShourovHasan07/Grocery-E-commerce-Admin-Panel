"use client";
import { useState, useEffect } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { useColorScheme } from "@mui/material/styles";

import { useSession } from "next-auth/react";

// Third-party Imports
import classnames from "classnames";

import pageApiHelper from "@/utils/pageApiHelper";

// Style Imports
import tableStyles from "@core/styles/table.module.css";
import { getCurrency, transactionStatusLabel, transactionStatusColor, getCardBrandImage } from "@/utils/helpers";
import { formattedDate } from "@/utils/formatters";

import TransactionSkeleton from "./TransactionSkeleton";

const LastDisbursement = ({ title }) => {
  // Hooks
  const { mode } = useColorScheme();


  const { data: session } = useSession();
  const token = session?.accessToken;
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (token) {
        try {
          const result = await pageApiHelper.get(
            "dashboard/latest-disbursements",
            {},
            token,
          );

          if (result.success && result?.data?.data) {
            setTransactions(result.data.data);
          }
        } catch (error) {
          // console.log("Error fetching booking stats:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchTransactions();
  }, [token]);

  if (loading) {
    return <TransactionSkeleton title={title} />;
  }

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
            {transactions?.map((trans, index) => (
              <tr key={index} className="border-0">
                <td className="pis-6 pli-2 plb-3">
                  <div className="flex items-center gap-4">
                    <Avatar
                      variant="rounded"
                      className={classnames("is-[50px] bs-[30px]", {
                        "bg-white": mode === "dark",
                        "bg-actionHover": mode === "light",
                      })}
                    >
                      <img
                        width={30}
                        alt={trans.cardBrand}
                        src={getCardBrandImage(trans.cardBrand).primary}
                        onError={(e) => {
                          e.target.src = getCardBrandImage(trans.cardBrand).fallback;
                        }}
                      />
                    </Avatar>
                    <div className="flex flex-col">
                      <Typography color="text.primary">
                        {trans?.last4 ? `*${trans.last4}` : "******"}
                      </Typography>
                    </div>
                  </div>
                </td>
                <td className="pli-2 plb-3">
                  <div className="flex flex-col gap-1">
                    <small>
                      {trans?.expert?.name
                        ? (trans.expert.name.length > 25
                          ? `${trans.expert.name.substring(0, 25)}...`
                          : trans.expert.name)
                        : "N/A"
                      }
                    </small>
                    <Typography variant="body2" color="text.disabled">
                      {formattedDate(trans.createdAt)}
                    </Typography>
                  </div>
                </td>
                <td className="pli-2 plb-3">
                  <Chip
                    variant="tonal"
                    label={transactionStatusLabel(trans.status)}
                    size="small"
                    color={transactionStatusColor(trans.status)}
                    className="capitalize"
                  />
                </td>
                <td className="pli-2 plb-3 pie-6 text-right">
                  <Typography color="text.primary">{getCurrency}{trans.amount}</Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default LastDisbursement;
