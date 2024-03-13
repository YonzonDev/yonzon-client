import { Routes, Route } from "react-router-dom";

import Landing from "./pages/Landing";
import Auth from "./pages/auth/Auth";
import NotFound from "./pages/NotFound";
import YonzonRoutes from "./routes/YonzonRoutes";
import "./App.css";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route index path="/" element={<Auth />} />
        <Route element={<Landing />} />
        <Route path="/yonzon/*" element={<YonzonRoutes />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;
