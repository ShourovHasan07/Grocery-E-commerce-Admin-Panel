"use client";

// Next Imports
import Link from "next/link";

// Third-party Imports
import classnames from "classnames";

// Hook Imports
import useHorizontalNav from "@menu/hooks/useHorizontalNav";

// Util Imports
import { horizontalLayoutClasses } from "@layouts/utils/layoutClasses";

const FooterContent = () => {
  // Hooks
  const { isBreakpointReached } = useHorizontalNav();

  return (
    <div
      className={classnames(
        horizontalLayoutClasses.footerContent,
        "flex items-center justify-between flex-wrap gap-4",
      )}
    >
      <p>
        <span className="text-textSecondary">{`© ${new Date().getFullYear()}, Developed by `}</span>
        <Link
          href="https://askvalor.co.uk"
          target="_blank"
          className="text-primary uppercase"
        >
          Askvalor LTD
        </Link>
      </p>
    </div>
  );
};

export default FooterContent;
