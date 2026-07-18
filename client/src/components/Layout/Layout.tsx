import Container from "@mui/material/Container";
import type { ReactNode } from "react";
import { Footer } from "../Footer";
import { LayoutMain, LayoutRoot } from "./layout.styles";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <LayoutRoot>
      <LayoutMain>
        <Container maxWidth="lg">{children}</Container>
      </LayoutMain>
      <Footer />
    </LayoutRoot>
  );
}
