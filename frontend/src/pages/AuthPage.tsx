import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Wallet, Shield, Zap } from 'lucide-react';
import NeonButton from '../components/NeonButton';
import GlassCard from '../components/GlassCard';

const AuthPage = () => {
  const [step, setStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const navigate = useNavigate();

  const handleWeb3Auth = () => {
    setIsConnecting(true);
    // Simulate authentication delay
    setTimeout(() => {
      setIsConnecting(false);
      setStep(2);
    }, 2000);
  };

  const handleWalletConnect = () => {
    setIsConnecting(true);
    // Simulate wallet connection
    setTimeout(() => {
      setIsConnecting(false);
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h1 className="font-orbitron text-4xl font-bold mb-4 text-cyber-green">
            Access Protocol
          </h1>
          <p className="text-gray-300">
            Authenticate to enter the CyberFit ecosystem
          </p>
        </motion.div>

        {step === 1 && (
          <GlassCard className="text-center">
            <div className="mb-6">
              <Shield className="w-16 h-16 text-cyber-green mx-auto mb-4 animate-pulse-glow" />
              <h2 className="font-orbitron text-2xl font-bold mb-2">
                Web3 Authentication
              </h2>
              <p className="text-gray-300 text-sm">
                Secure decentralized identity verification
              </p>
            </div>

            {/* Circuit pattern */}
            <div className="relative mb-6 h-20">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-0.5 bg-cyber-green opacity-30 relative">
                  <motion.div
                    className="absolute top-0 left-0 w-2 h-2 bg-cyber-green rounded-full"
                    animate={{ x: [0, 300, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                  />
                </div>
              </div>
              <div className="absolute top-1/2 left-1/4 w-1 h-8 bg-cyber-green opacity-30 transform -translate-y-1/2" />
              <div className="absolute top-1/2 right-1/4 w-1 h-8 bg-cyber-green opacity-30 transform -translate-y-1/2" />
            </div>

            <NeonButton
              onClick={handleWeb3Auth}
              className="w-full"
              size="lg"
            >
              {isConnecting ? (
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="w-5 h-5 animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Initialize Auth Sequence'
              )}
            </NeonButton>
          </GlassCard>
        )}

        {step === 2 && (
          <GlassCard className="text-center">
            <div className="mb-6">
              <Wallet className="w-16 h-16 text-cyber-green mx-auto mb-4 animate-pulse-glow" />
              <h2 className="font-orbitron text-2xl font-bold mb-2">
                Wallet Connection
              </h2>
              <p className="text-gray-300 text-sm">
                Connect your MetaMask wallet to access staking features
              </p>
            </div>

            {/* Wallet visualization */}
            <div className="relative mb-6 h-20">
              <motion.div
                className="absolute inset-0 border-2 border-cyber-green rounded-lg opacity-30"
                animate={{ 
                  boxShadow: [
                    '0 0 10px #39FF14',
                    '0 0 30px #39FF14',
                    '0 0 10px #39FF14'
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="flex items-center justify-center h-full">
                <span className="font-orbitron text-cyber-green font-bold">
                  MetaMask
                </span>
              </div>
            </div>

            <NeonButton
              onClick={handleWalletConnect}
              className="w-full"
              size="lg"
            >
              {isConnecting ? (
                <div className="flex items-center justify-center space-x-2">
                  <Zap className="w-5 h-5 animate-spin" />
                  <span>Connecting Wallet...</span>
                </div>
              ) : (
                'Connect MetaMask'
              )}
            </NeonButton>

            <motion.button
              className="mt-4 text-gray-400 hover:text-cyber-green transition-colors text-sm"
              onClick={() => setStep(1)}
              whileHover={{ scale: 1.05 }}
            >
              ← Back to Authentication
            </motion.button>
          </GlassCard>
        )}

        {/* Status indicators */}
        <div className="flex justify-center space-x-4 mt-6">
          <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-cyber-green' : 'bg-gray-600'} ${step === 1 ? 'animate-pulse-glow' : ''}`} />
          <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-cyber-green' : 'bg-gray-600'} ${step === 2 ? 'animate-pulse-glow' : ''}`} />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;