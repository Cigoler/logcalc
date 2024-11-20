import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from "./routes/root.tsx";
import ErrorPage from "./error-page.tsx";
import './App.css'
import App from './App.tsx';
import { Calculator } from './components/calculator/calculator.tsx';
import { SettingsPage } from './components/settings/settings-page.tsx';
import { ShiftsPage } from './components/shifts/shifts-page.tsx';
import { DocumentationPage } from './components/documentation/documentation-page.tsx';
import { LogbookPage } from './components/logbook/logbook-page.tsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/calculator",
        element: <Calculator />,
      },
      {
        path: "/shifts",
        element: <ShiftsPage />,
      },
      {
        path: "/docs",
        element: <DocumentationPage />,
      },
      {
        path: "/logbook",
        element: <LogbookPage />,
      },
      {
        path: "/settings",
        element: <SettingsPage />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
