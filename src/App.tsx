import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Table from "./pages/Table";
import NotFound from "./pages/NotFound";
import OfflineModal from "./components/OfflineModal";
import { useOnlineStatus } from "./hooks/useOnlineStatus";

function App() {
  const isOnline = useOnlineStatus();
  const [dismissed, setDismissed] = useState(false);

  // Re-arm the modal every time a fresh "offline" transition happens,
  // even if the user dismissed it during a previous drop
  useEffect(() => {
    if (!isOnline) {
      setDismissed(false);
    }
  }, [isOnline]);

  const showModal = !isOnline && !dismissed;

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/table"
            element={
              <ProtectedRoute>
                <Table />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>

      {showModal && <OfflineModal onDismiss={() => setDismissed(true)} />}
    </AuthProvider>
  );
}

export default App;
