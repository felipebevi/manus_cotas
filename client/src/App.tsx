import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import CityListing from "./pages/CityListing";
import DevelopmentDetails from "./pages/DevelopmentDetails";
import ReservationDates from "./pages/ReservationDates";
import ReservationPayment from "./pages/ReservationPayment";
import ReservationSuccess from "./pages/ReservationSuccess";
import DocumentUpload from "./pages/DocumentUpload";
import CotistaRegister from "./pages/CotistaRegister";
import AdminDashboard from "./pages/AdminDashboard";
import AdminDocuments from "./pages/AdminDocuments";
import AdminCotistas from "./pages/AdminCotistas";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/city/:citySlug"} component={CityListing} />
      <Route path={"/development/:developmentSlug"} component={DevelopmentDetails} />
      <Route path={"/reserve/:developmentSlug"} component={ReservationDates} />
      <Route path={"/reservation/:reservationId/payment"} component={ReservationPayment} />
      <Route path={"/reservation/:reservationId/success"} component={ReservationSuccess} />
      <Route path={"/reservation/:reservationId/documents"} component={DocumentUpload} />
      <Route path={"/cotista/register"} component={CotistaRegister} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/documents"} component={AdminDocuments} />
      <Route path={"/admin/cotistas"} component={AdminCotistas} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
