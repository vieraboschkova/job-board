import { styled } from "@mui/material/styles";

export const FooterRoot = styled("footer")(({ theme }) => ({
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
  borderTop: `1px solid ${theme.palette.divider}`,
}));
