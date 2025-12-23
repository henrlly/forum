import { Sort as SortIcon } from "@mui/icons-material";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  type SelectChangeEvent,
  Stack,
} from "@mui/material";

export interface SortOption {
  value: { sort: string; order_by: string };
  label: string;
}

export interface SortProps {
  sortValue: number;
  onSortChange: (value: number) => void;
  sortOptions: SortOption[];
  label?: string;
  size?: "small" | "medium";
  minWidth?: number;
}

export function Sort({
  sortValue,
  onSortChange,
  sortOptions,
  label = "Sort by",
  size = "small",
  minWidth = 180,
}: SortProps) {
  const handleSortChange = (event: SelectChangeEvent<number>) => {
    onSortChange(event.target.value);
  };

  const labelComponent = (
    <Stack direction="row" gap={0.5}>
      <SortIcon fontSize="small" />
      {label}
    </Stack>
  );

  return (
    <FormControl size={size} sx={{ minWidth }}>
      <InputLabel>{labelComponent}</InputLabel>
      <Select
        value={sortValue}
        onChange={handleSortChange}
        label={labelComponent}
      >
        {sortOptions.map((option, index) => (
          <MenuItem key={option.label} value={index}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
