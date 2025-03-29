import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://88ed8380e55042be9937e4b42fd95726@o164625.ingest.us.sentry.io/1418218",
  integrations: [
  ],
  // // Set `tracePropagationTargets` to control for which URLs trace propagation should be enabled
  // tracePropagationTargets: [/^\//, /^https:\/\/yourserver\.io\/api/],
});

const container = document.getElementById("root");
createRoot(container!, {
  // Callback called when an error is thrown and not caught by an ErrorBoundary.
  onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
    console.warn('Uncaught error', error, errorInfo.componentStack);
  }),
  // Callback called when React catches an error in an ErrorBoundary.
  onCaughtError: Sentry.reactErrorHandler(),
  // Callback called when React automatically recovers from errors.
  onRecoverableError: Sentry.reactErrorHandler(),
})
  .render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
