import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppShell } from "./layouts/AppShell";
import { DashboardPage } from "./pages/DashboardPage";

// Minimal placeholders for other pages
function ScriptsPage() {
  return <div className="p-8 text-slate-400">Comment Scripts Config (TODO)</div>;
}

function ReportsPage() {
  return <div className="p-8 text-slate-400">Post-Live Reports (TODO)</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<DashboardPage />} />
          <Route path="scripts" element={<ScriptsPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
