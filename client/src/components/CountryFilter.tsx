import ClearIcon from "@mui/icons-material/Clear";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { COUNTRY_OPTIONS, type CountryCode } from "../types/job";

interface CountryFilterProps {
  value: "" | CountryCode;
  onChange: (value: "" | CountryCode) => void;
}

export function CountryFilter({ value, onChange }: CountryFilterProps) {
  const handleChange = (event: SelectChangeEvent<"" | CountryCode>) => {
    onChange(event.target.value as "" | CountryCode);
  };

  return (
    <FormControl size="small" sx={{ minWidth: 160 }}>
      <InputLabel id="country-filter-label">Country</InputLabel>
      <Select
        labelId="country-filter-label"
        id="country-filter"
        label="Country"
        value={value}
        onChange={handleChange}
        endAdornment={
          value ? (
            <InputAdornment position="end" sx={{ mr: 2 }}>
              <IconButton
                aria-label="Clear country"
                size="small"
                onClick={(event) => {
                  event.stopPropagation();
                  onChange("");
                }}
                onMouseDown={(event) => event.stopPropagation()}
              >
                <ClearIcon fontSize="small" />
              </IconButton>
            </InputAdornment>
          ) : undefined
        }
      >
        <MenuItem value="">All countries</MenuItem>
        {COUNTRY_OPTIONS.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
