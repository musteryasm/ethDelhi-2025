import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Activity, Target, Trophy, Zap } from "lucide-react";
import NeonButton from "../components/NeonButton";
import GlassCard from "../components/GlassCard";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative z-10">
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center relative overflow-hidden">
        {/* Animated skyline */}
        <div className="absolute bottom-0 left-0 right-0 h-64 opacity-30">
          <div className="flex items-end justify-center h-full space-x-1">
            {Array.from({ length: 50 }, (_, i) => (
              <motion.div
                key={i}
                className="bg-cyber-green opacity-20"
                style={{
                  width: Math.random() * 20 + 5,
                  height: Math.random() * 200 + 50,
                }}
                animate={{
                  height: [
                    Math.random() * 200 + 50,
                    Math.random() * 300 + 100,
                    Math.random() * 200 + 50,
                  ],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>
        </div>

        <div className="text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-orbitron text-6xl md:text-8xl font-black mb-6 text-glow">
              Fitter<span className="text-cyber-green">Coin</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
              It pays to get fit. Incentivise fitness
            </p>
            <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8 mb-12">
              <div className="flex items-center space-x-2 text-cyber-green">
                <Target className="w-6 h-6" />
                <span className="font-orbitron uppercase">Stake</span>
              </div>
              <div className="flex items-center space-x-2 text-cyber-green">
                <Activity className="w-6 h-6" />
                <span className="font-orbitron uppercase">Sweat</span>
              </div>
              <div className="flex items-center space-x-2 text-cyber-green">
                <Trophy className="w-6 h-6" />
                <span className="font-orbitron uppercase">Earn</span>
              </div>
            </div>
            <div className="flex justify-center">
              <NeonButton
                size="md"
                variant="primary"
                onClick={() => navigate("/self")}
                className="animate-pulse-glow"
              >
                Enter the Challenge
              </NeonButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="font-orbitron text-4xl font-bold mb-6 text-cyber-green">
              The Future of Fitness
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Revolutionary blockchain-powered fitness platform where your
              commitment pays off
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <GlassCard glowEffect>
              <div className="text-center">
                <Zap className="w-12 h-12 text-cyber-green mx-auto mb-4" />
                <h3 className="font-orbitron text-xl font-bold mb-3">
                  Smart Staking
                </h3>
                <p className="text-gray-300">
                  Stake your crypto on fitness challenges. Complete them to
                  reclaim your stake plus rewards.
                </p>
              </div>
            </GlassCard>

            <GlassCard glowEffect>
              <div className="text-center">
                <Activity className="w-12 h-12 text-cyber-green mx-auto mb-4" />
                <h3 className="font-orbitron text-xl font-bold mb-3">
                  AI Verification
                </h3>
                <p className="text-gray-300">
                  Advanced computer vision tracks your workouts in real-time
                  with precision accuracy.
                </p>
              </div>
            </GlassCard>

            <GlassCard glowEffect>
              <div className="text-center">
                <Trophy className="w-12 h-12 text-cyber-green mx-auto mb-4" />
                <h3 className="font-orbitron text-xl font-bold mb-3">
                  Prize Pools
                </h3>
                <p className="text-gray-300">
                  Compete in tournaments and betting pools to win big from
                  community prize funds.
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="font-orbitron text-3xl font-bold mb-6">
            Ready to Transform Your Fitness?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of crypto athletes already earning while they train
          </p>
          <NeonButton size="lg" onClick={() => navigate("/auth")}>
            Start Earning Now
          </NeonButton>
        </motion.div>
      </section>
    </div>
  );
};

export default LandingPage;
