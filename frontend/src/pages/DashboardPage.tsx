import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Trophy,
  DollarSign,
  BarChart3,
  User,
  Menu,
  X,
  Bell,
  Search,
  PlayIcon,
  PlayCircleIcon,
} from "lucide-react";
import ProfileCard from "../components/ProfileCard";
import ChallengesPage from "./ChallengePage";
import ContestsPage from "./ContestsPage";
import BettingPage from "./BettingPage";
import DashboardAnalyticsPage from "./DashboardAnalyticsPage";
import ProfilePage from "../components/ProfilePage";
import { useUserProfile } from "../hooks/useUserProfile";
import LiveBettingPage from "./LiveBetting";

type ActiveTab =
  | "challenges"
  | "contests"
  | "betting"
  | "dashboard"
  | "profile";

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("challenges");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [notifications, setNotifications] = useState(3);
  const profile = useUserProfile();

  const tabs = [
    {
      id: "challenges",
      label: "AI Challenges",
      icon: Target,
      color: "text-blue-400",
    },
    {
      id: "contests",
      label: "Public Contests",
      icon: Trophy,
      color: "text-yellow-400",
    },
    {
      id: "betting",
      label: "Betting",
      icon: DollarSign,
      color: "text-green-400",
    },
    {
      id: "dashboard",
      label: "Analytics",
      icon: BarChart3,
      color: "text-purple-400",
    },
    { id: "profile", label: "Profile", icon: User, color: "text-pink-400" },
    {
      id: "live",
      label: "Live Stream",
      icon: PlayCircleIcon,
      color: "text-pink-400",
    },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "challenges":
        return <ChallengesPage />;
      case "contests":
        return <ContestsPage />;
      case "betting":
        return <BettingPage />;
      case "dashboard":
        return <DashboardAnalyticsPage />;
      case "profile":
        return <ProfilePage />;
      case "live":
        return <LiveBettingPage />;
      default:
        return <ChallengesPage />;
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-cyber-black via-gray-900 to-cyber-black relative">
      {/* Sidebar */}
      <motion.div
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="bg-cyber-black bg-opacity-80 backdrop-blur-xl border-r border-cyber-green border-opacity-20 flex flex-col relative z-20"
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Header */}
        <div className="p-4 border-b border-cyber-green border-opacity-10">
          <div className="flex justify-between items-center">
            <AnimatePresence>
              {isSidebarOpen && (
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="font-orbitron text-2xl font-bold text-cyber-green"
                >
                  Fitter<span className="text-white">Coin</span>
                </motion.h1>
              )}
            </AnimatePresence>

            <motion.button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-cyber-green p-2 rounded-lg hover:bg-cyber-green hover:bg-opacity-20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`w-full flex items-center rounded-xl transition-all duration-300 group relative overflow-hidden ${
                    isSidebarOpen ? "px-4 py-3" : "justify-center py-3"
                  } ${
                    isActive
                      ? "bg-cyber-green bg-opacity-20 text-cyber-green border border-cyber-green shadow-lg shadow-cyber-green/20"
                      : "text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-5"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? "text-cyber-green" : tab.color
                    }`}
                  />
                  <AnimatePresence>
                    {isSidebarOpen && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        className="ml-3 font-medium whitespace-nowrap"
                      >
                        {tab.label}
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-cyber-green rounded-r-full"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </nav>

        {/* Profile Section */}
        <div className="p-4 border-t border-cyber-green border-opacity-10">
          <ProfileCard isCollapsed={!isSidebarOpen} />
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-cyber-black bg-opacity-40 backdrop-blur border-b border-cyber-green border-opacity-10 p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-orbitron text-xl font-bold text-white capitalize">
                {activeTab === "dashboard" ? "Analytics" : activeTab}
              </h2>
              <p className="text-gray-400 text-sm">
                {profile ? `Welcome back, ${profile.nickname}` : "Loading..."}
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-gray-900 bg-opacity-50 border border-cyber-green border-opacity-30 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-cyber-green focus:outline-none w-64"
                />
              </div>

              <motion.button
                className="relative p-2 text-gray-400 hover:text-cyber-green transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bell className="w-5 h-5" />
                {notifications > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  >
                    {notifications}
                  </motion.div>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto"
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
