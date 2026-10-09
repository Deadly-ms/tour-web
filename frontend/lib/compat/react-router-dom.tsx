"use client";

import React from "react";
import NextLink from "next/link";

export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string;
  href?: string;
}

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ to, href, children, ...props }, ref) => {
    const destination = href || to || "/";
    return (
      <NextLink ref={ref} href={destination} {...props}>
        {children}
      </NextLink>
    );
  }
);

Link.displayName = "Link";

export default { Link };
