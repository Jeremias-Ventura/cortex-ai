import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ExampleBased from "./pages/ExampleBased";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* LearnPage WITHOUT MainLayout */}
        <Route path="/" element={<HomePage />} />

        {/* Routes that DO use MainLayout */}
        <Route element={<MainLayout />}>
          <Route
            path="/example"
            element={
              <ProtectedRoute>
                <ExampleBased />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
