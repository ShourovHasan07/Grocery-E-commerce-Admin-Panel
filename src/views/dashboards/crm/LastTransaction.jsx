"use client";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import { useColorScheme } from "@mui/material/styles";

// Third-party Imports
import classnames from "classnames";

// Components Imports
import OptionMenu from "@core/components/option-menu";

// Style Imports
import tableStyles from "@core/styles/table.module.css";
import { getCurrency } from "@/utils/helpers";

// Vars
const data = [
  {
    amount: 28,
    status: "paid",
    cardType: "Credit",
    cardNumber: "*4230",
    imgName: "visa",
    date: `17 Mar ${new Date().getFullYear()}`,
  },
  {
    amount: 23,
    status: "failed",
    cardType: "Credit",
    cardNumber: "*5578",
    imgName: "mastercard",
    date: `12 Feb ${new Date().getFullYear()}`,
  },
  {
    amount: 12,
    cardType: "ATM",
    status: "paid",
    cardNumber: "*4567",
    imgName: "american-express",
    date: `28 Feb ${new Date().getFullYear()}`,
  },
  {
    amount: 42,
    status: "pending",
    cardType: "Credit",
    cardNumber: "*5699",
    imgName: "visa",
    date: `08 Jan ${new Date().getFullYear()}`,
  },
  {
    amount: 38,
    status: "failed",
    cardType: "Credit",
    cardNumber: "*2451",
    imgName: "visa",
    date: `19 Oct ${new Date().getFullYear()}`,
  }
];

const statusObj = {
  pending: { text: "Pending", color: "secondary" },
  failed: { text: "Failed", color: "error" },
  paid: { text: "Paid", color: "success" },
};

const LastTransaction = ({ title }) => {
  // Hooks
  const { mode } = useColorScheme();

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
            {data.map((row, index) => (
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
                        alt={row.imgName}
                        src={`/images/logos/${row.imgName}.png`}
                      />
                    </Avatar>
                    <div className="flex flex-col">
                      <Typography color="text.primary">
                        {row.cardNumber}
                      </Typography>
                    </div>
                  </div>
                </td>
                <td className="pli-2 plb-3">
                  <div className="flex flex-col">
                    <Typography variant="body2" color="text.disabled">
                      {row.date}
                    </Typography>
                  </div>
                </td>
                <td className="pli-2 plb-3">
                  <Chip
                    variant="tonal"
                    size="small"
                    label={statusObj[row.status].text}
                    color={statusObj[row.status].color}
                  />
                </td>
                <td className="pli-2 plb-3 pie-6 text-right">
                  <Typography color="text.primary">{getCurrency} {row.amount}</Typography>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default LastTransaction;
