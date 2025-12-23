import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import {
  type AuthContextType,
  AuthProvider,
  useAuth,
} from "@/contexts/AuthContext";
import { SnackbarProvider } from "@/contexts/SnackbarContext";

// Import the generated route tree
import { routeTree } from "@/routeTree.gen";

import "@/styles.css";
import type { AxiosError } from "axios";
import { Loading } from "@/components/common/Loading";
import NotFoundPage from "@/components/pages/NotFoundPage";
import { DEFAULT_QUERY_STALE_TIME } from "@/constants/query";
import reportWebVitals from "@/reportWebVitals";

// MUI theme
const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

const router = createRouter({
  routeTree,
  context: {
    auth: {} as AuthContextType,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
  defaultNotFoundComponent: NotFoundPage,
  search: { strict: true }, // drop unknown search params by default
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: DEFAULT_QUERY_STALE_TIME, // 5 minutes
      retry: (failureCount, error: Error | AxiosError) => {
        // Don't retry on 4xx errors
        if (error) {
          const err = error as AxiosError;
          if (
            err.response &&
            err.response.status >= 400 &&
            err.response.status < 500
          ) {
            return false;
          }
        }
        return failureCount < 3;
      },
    },
  },
});

function App() {
  const auth = useAuth();

  // This prevents the router from running redirects (like kicking you to login)
  // before the browser has finished checking if you have a session cookie.
  if (auth.isLoading) {
    return <Loading isPage={true} loadingText="Loading forum..." />;
  }

  return <RouterProvider router={router} context={{ auth }} />;
}

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <SnackbarProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </SnackbarProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
