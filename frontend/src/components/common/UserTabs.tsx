import { Tab, Tabs } from "@mui/material";
import { Link } from "@tanstack/react-router";

export interface UserTabsProps {
  tabSelected: "posts" | "comments";
}

export function UserTabs({ tabSelected }: UserTabsProps) {
  return (
    <Tabs value={tabSelected} sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tab
        label="Posts"
        value="posts"
        component={Link}
        to="/users/$username/posts"
      />
      <Tab
        label="Comments"
        value="comments"
        component={Link}
        to="/users/$username/comments"
      />
    </Tabs>
  );
}
