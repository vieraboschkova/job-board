import ClearIcon from "@mui/icons-material/Clear";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import type { CountryCode, JobSort } from "../types/job";
import { CountryFilter } from "./CountryFilter";
import { SortSelect } from "./SortSelect";

interface SearchToolbarProps {
  search: string;
  country: "" | CountryCode;
  sort: "" | JobSort;
  onSearchChange: (value: string) => void;
  onCountryChange: (value: "" | CountryCode) => void;
  onSortChange: (value: "" | JobSort) => void;
}

export function SearchToolbar({
  search,
  country,
  sort,
  onSearchChange,
  onCountryChange,
  onSortChange,
}: SearchToolbarProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={2}
      alignItems={{ xs: "stretch", sm: "center" }}
      useFlexGap
      flexWrap="wrap"
    >
      <TextField
        size="small"
        label="Search title or company"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        sx={{ flexGrow: 1, minWidth: { xs: "100%", sm: 220 } }}
        InputProps={{
          endAdornment: search ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="Clear search"
                edge="end"
                size="small"
                onClick={() => onSearchChange("")}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined,
        }}
      />
      <CountryFilter value={country} onChange={onCountryChange} />
      <SortSelect value={sort} onChange={onSortChange} />
    </Stack>
  );
}
