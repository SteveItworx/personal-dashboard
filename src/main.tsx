import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./contexts/AuthContext";
import { TodoProvider } from "./contexts/TodoContext";
import { NewsProvider } from "./contexts/NewsContext";
import { CalendarProvider } from "./contexts/CalendarContext";
import { ThemeProviderCustom } from "./contexts/ThemeContext";
import { WidgetProvider } from "./contexts/WidgetContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <TodoProvider>
        <NewsProvider>
          <CalendarProvider>
            <WidgetProvider>
              <ThemeProviderCustom>
                <App />
              </ThemeProviderCustom>
            </WidgetProvider>
          </CalendarProvider>
        </NewsProvider>
      </TodoProvider>
    </AuthProvider>
  </StrictMode>
);
