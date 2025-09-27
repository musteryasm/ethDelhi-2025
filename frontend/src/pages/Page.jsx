"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Shield, Zap, Lock, Globe } from "lucide-react";
import {
  SelfQRcodeWrapper,
  SelfAppBuilder,
  countries,
  getUniversalLink,
} from "@selfxyz/qrcode";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import GlassCard from "../components/GlassCard";
import NeonButton from "../components/NeonButton";

export default function Web3AuthQR() {
  const navigate = useNavigate();

  const [linkCopied, setLinkCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [selfApp, setSelfApp] = useState("");
  const [universalLink, setUniversalLink] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);

  const userId = ethers.ZeroAddress;
  const excludedCountries = useMemo(() => [countries.PAKISTAN], []);

  // Initialize Self app
  useEffect(() => {
    try {
      const app = new SelfAppBuilder({
        version: 2,
        appName: import.meta.env.VITE_SELF_APP_NAME || "Fitness Web3",
        scope: import.meta.env.VITE_SELF_SCOPE || "self-workshop",
        endpoint: import.meta.env.VITE_SELF_ENDPOINT,
        logoBase64: "https://i.postimg.cc/mrmVf9hm/self.png",
        userId: "0xaDB15D0C1Bc78Ee8e851421c9E70271739a583DB",
        endpointType: "staging_https",
        userIdType: "hex",
        userDefinedData: "Fitness Web3!!!",
        disclosures: {
          minimumAge: 18,
          excludedCountries,
          name: true,
          nationality: true,
          date_of_birth: true,
          gender: true,
        },
      }).build();

      setSelfApp(app);
      setUniversalLink(getUniversalLink(app));
    } catch (error) {
      console.error("Failed to initialize Self app:", error);
    }
  }, [excludedCountries]);

  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const copyToClipboard = () => {
    if (!universalLink) return;

    navigator.clipboard
      .writeText(universalLink)
      .then(() => {
        setLinkCopied(true);
        displayToast("Universal link copied to clipboard!");
        setTimeout(() => setLinkCopied(false), 2000);
      })
      .catch(() => displayToast("Failed to copy link"));
  };

  const openSelfApp = () => {
    if (!universalLink) return;
    window.open(universalLink, "_blank");
    displayToast("Opening Self App...");
  };

  const handleSuccessfulVerification = (data) => {
    try {
      console.log("Verified Data:", data);
    } catch (error) {
      console.error("Error logging data:", error);
    } finally {
      setTimeout(() => {
        navigate("/dashboard");
        setTimeout(() => window.location.reload(), 100);
      }, 10000);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-900 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <GlassCard className="max-w-md w-full text-center p-6">
        {/* Animated Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
          className="mb-6"
        >
          <div className="w-20 h-20 bg-cyber-green bg-opacity-20 rounded-full border-2 border-cyber-green mx-auto mb-4 flex items-center justify-center">
            <Shield className="w-10 h-10 text-cyber-green" />
          </div>
        </motion.div>

        <h2 className="font-orbitron text-2xl font-bold mb-2 text-cyber-green">
          Web3 Authentication
        </h2>
        <p className="text-gray-300 text-sm mb-6">
          Scan the QR code with Self Protocol App to verify your identity
        </p>

        {/* QR Code */}
        <div className="flex justify-center mb-4">
          {selfApp ? (
            <SelfQRcodeWrapper
              selfApp={selfApp}
              onSuccess={handleSuccessfulVerification}
              onError={() => displayToast("Error: Failed to verify identity")}
            />
          ) : (
            <div className="w-[256px] h-[256px] bg-gray-800 animate-pulse flex items-center justify-center rounded-lg">
              <p className="text-gray-400 text-sm">Loading QR Code...</p>
            </div>
          )}
        </div>

        {/* Features */}
        <div className="space-y-3 mb-6 text-left">
          <div className="flex items-center space-x-3 text-sm">
            <Lock className="w-4 h-4 text-cyber-green" />
            <span className="text-gray-300">End-to-end encrypted</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <Globe className="w-4 h-4 text-cyber-green" />
            <span className="text-gray-300">Decentralized identity</span>
          </div>
          <div className="flex items-center space-x-3 text-sm">
            <Shield className="w-4 h-4 text-cyber-green" />
            <span className="text-gray-300">Zero-knowledge proofs</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <NeonButton onClick={copyToClipboard} className="flex-1" size="md">
            {linkCopied ? "Copied!" : "Copy Universal Link"}
          </NeonButton>
          <NeonButton onClick={openSelfApp} className="flex-1" size="md">
            Open Self App
          </NeonButton>
        </div>

        {/* User Address */}
        <div className="flex flex-col items-center gap-2 mt-2">
          <span className="text-gray-500 text-xs uppercase tracking-wide">
            User Address
          </span>
          <div className="bg-gray-800 rounded-md px-3 py-2 w-full text-center break-all text-sm font-mono text-cyber-green border border-gray-700">
            {userId || <span className="text-gray-500">Not connected</span>}
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          Powered by blockchain technology
        </div>

        {/* Toast */}
        {showToast && (
          <div className="fixed bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded shadow-lg animate-fade-in text-sm">
            {toastMessage}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
