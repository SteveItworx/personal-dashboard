import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { PaletteMode } from "@mui/material";

interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProviderCustom = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>("light");

  useEffect(() => {
    const savedMode = localStorage.getItem("theme") as PaletteMode | null;
    if (savedMode) setMode(savedMode);
  }, []);

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("theme", newMode);
  };

  const theme = createTheme({
    palette: {
      mode,
      ...(mode === "dark"
        ? {
            primary: { main: "#90caf9" },
            background: { default: "#121212", paper: "#1e1e1e" },
            text: { primary: "#ffffff" },
          }
        : {
            primary: { main: "#1976d2" },
            background: { default: "#f5f5f5", paper: "#ffffff" },
            text: { primary: "#000000" },
          }),
    },
  });

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeCustom = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useThemeCustom must be used within ThemeProviderCustom");
  return context;
};
