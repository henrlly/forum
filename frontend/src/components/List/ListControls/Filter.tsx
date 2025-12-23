import { FilterList } from "@mui/icons-material";
import { FormControlLabel, Stack, Switch } from "@mui/material";
import type { ChangeEvent } from "react";

export interface FilterOption {
  id: string | number;
  name: string;
}

export interface FilterProps {
  filterValue: boolean;
  onFilterChange: (value: boolean) => void;
  filterLabel: string;
  size?: "small" | "medium";
  minWidth?: number;
}

export function Filter({
  filterValue,
  onFilterChange,
  filterLabel,
  size = "small",
  minWidth = 220,
}: FilterProps) {
  const handleToggleChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFilterChange(event.target.checked);
  };

  return (
    <FormControlLabel
      control={
        <Switch
          checked={filterValue}
          onChange={handleToggleChange}
          size={size}
        />
      }
      label={
        <Stack direction="row" alignItems="center" gap={0.5}>
          <FilterList fontSize="small" />
          {filterLabel}
        </Stack>
      }
      labelPlacement="end"
      sx={{ minWidth }}
    />
  );
}
