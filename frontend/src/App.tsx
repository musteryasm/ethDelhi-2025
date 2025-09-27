import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ContestResultPage from "./pages/ContestResultPage";
import ParticleBackground from "./components/ParticleBackground";
import Web3AuthQR from "./pages/Page";
import BettingPage from "./pages/LiveBetting";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-cyber-black text-white relative overflow-hidden">
        <ParticleBackground />
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/contest-result" element={<ContestResultPage />} />
            <Route path="/self" element={<Web3AuthQR />} />
            <Route path="/live-betting" element={<BettingPage />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  );
}

export default App;
