import { Search as SearchIcon } from "@mui/icons-material";
import { InputAdornment, TextField } from "@mui/material";
import type { ChangeEvent } from "react";

export interface SearchProps {
  searchValue?: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  fullWidth?: boolean;
  minWidth?: number;
  size?: "small" | "medium";
}

export function Search({
  searchValue,
  onSearchChange,
  placeholder = "Search...",
  fullWidth = true,
  minWidth = 200,
  size = "small",
}: SearchProps) {
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  return (
    <TextField
      placeholder={placeholder}
      value={searchValue ?? ""}
      onChange={handleSearchChange}
      size={size}
      fullWidth={fullWidth}
      sx={{
        minWidth,
      }}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        },
      }}
    />
  );
}
