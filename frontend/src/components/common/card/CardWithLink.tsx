import { Card } from "@mui/material";
import { Link } from "@tanstack/react-router";
import type { MouseEvent, ReactNode } from "react";

function checkIgnoreNestedLink(e: MouseEvent<HTMLAnchorElement>) {
  let cur = e.target as HTMLElement;

  while (cur) {
    if (cur.dataset?.ignoreNestedLink) {
      return true;
    }

    if (cur.parentElement) {
      cur = cur.parentElement;
    } else {
      break;
    }
  }

  return false;
}

interface CardWithLinkProps {
  link?: string;
  children: ReactNode;
}

// Buttons inside the card will not trigger the card link
// if they have the data-ignore-nested-link attribute.
export function CardWithLink({ link, children }: CardWithLinkProps) {
  if (!link) {
    return <Card elevation={3}>{children}</Card>;
  }

  return (
    <Card
      sx={{
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: (theme) => theme.shadows[4],
        },
      }}
      onClick={(e) => {
        if (checkIgnoreNestedLink(e)) {
          e.preventDefault();
        }
      }}
      component={Link}
      to={link}
    >
      {children}
    </Card>
  );
}
