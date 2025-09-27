import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Web3AuthStep from '../components/Web3AuthStep';
import WalletConnectStep from '../components/WalletConnectStep';
import VerificationStep from '../components/VerificationStep';
import ProgressIndicator from '../components/ProgressIndicator';

type UserInfo = { wallet?: string; goal?: string; nickname?: string };

const AuthPage = () => {
  const [step, setStep] = useState(1);
  const [isConnecting, setIsConnecting] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({});
  const navigate = useNavigate();

  const handleWeb3Auth = () => {
    setIsConnecting(true);
    setTimeout(() => {
      setIsConnecting(false);
      setStep(2);
    }, 2000);
  };

  const handleWalletConnect = async () => {
    setIsConnecting(true);
    try {
      const { ethereum } = window as typeof window & {
        ethereum?: { request?: (args: { method: string; params?: unknown[] }) => Promise<any> };
      };
      
      if (!ethereum) {
        alert('MetaMask not found. Please install MetaMask to continue.');
        setIsConnecting(false);
        return;
      }
      
      const accounts = await ethereum.request!({ method: 'eth_requestAccounts' });
      setUserInfo((prev) => ({ ...prev, wallet: accounts[0] }));
      setIsConnecting(false);
      setStep(3);
    } catch (error) {
      console.error('Wallet connection failed:', error);
      setIsConnecting(false);
    }
  };

  const handleVerificationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const goal = formData.get('goal') as string;
    const nickname = formData.get('nickname') as string;
    
    setUserInfo((prev) => ({ ...prev, goal, nickname }));
    
    // Store user info in localStorage or send to backend
    localStorage.setItem('cyberfit_user', JSON.stringify({
      ...userInfo,
      goal,
      nickname,
      timestamp: Date.now()
    }));
    
    navigate('/dashboard');
  };

  const handleBack = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative z-10">
      <div className="max-w-md w-full">
        <motion.div
          initial={{ opacity: 0, y: -30 }}
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

        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <Web3AuthStep 
              isConnecting={isConnecting} 
              onAuth={handleWeb3Auth} 
            />
          )}

          {step === 2 && (
            <WalletConnectStep 
              isConnecting={isConnecting} 
              onConnect={handleWalletConnect}
              onBack={handleBack}
            />
          )}

          {step === 3 && (
            <VerificationStep 
              wallet={userInfo.wallet}
              onSubmit={handleVerificationSubmit}
            />
          )}
        </motion.div>

        <ProgressIndicator currentStep={step} totalSteps={3} />
      </div>
    </div>
  );
};

export default AuthPage;