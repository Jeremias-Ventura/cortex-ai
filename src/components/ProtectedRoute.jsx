import { useState, useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  // Get password from environment variable
  const requiredPassword = process.env.REACT_APP_CHAT_PASSWORD;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputPassword, setInputPassword] = useState("");
  const [error, setError] = useState("");

  // Check if already authenticated (stored in sessionStorage)
  useEffect(() => {
    const storedAuth = sessionStorage.getItem("chat-authenticated");
    if (storedAuth === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputPassword === requiredPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem("chat-authenticated", "true");
      setError("");
    } else {
      setError("Incorrect password");
      setInputPassword("");
    }
  };

  if (isAuthenticated) {
    return children;
  }

  return (
    <div className="min-h-screen bg-main flex items-center justify-center text-white">
      <div className="bg-side p-8 rounded-2xl shadow-xl max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Access Required</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Enter Password
            </label>
            <input
              type="password"
              value={inputPassword}
              onChange={(e) => setInputPassword(e.target.value)}
              className="w-full p-3 bg-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple1"
              placeholder="Password"
              required
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-purple1 hover:bg-purple-600 p-3 rounded-lg font-medium transition"
          >
            Access Chat
          </button>
        </form>
        <p className="text-gray-400 text-xs mt-4 text-center">
          Contact admin for access
        </p>
      </div>
    </div>
  );
};

export default ProtectedRoute;