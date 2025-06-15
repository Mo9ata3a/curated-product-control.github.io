
import { useState, useCallback } from 'react';

interface AuthAttempt {
  email: string;
  attempts: number;
  lastAttempt: number;
  blockedUntil?: number;
}

const MAX_ATTEMPTS = 5;
const INITIAL_DELAY = 30000; // 30 secondes
const MAX_DELAY = 300000; // 5 minutes

export const useAuthAttempts = () => {
  const [attempts, setAttempts] = useState<Map<string, AuthAttempt>>(new Map());

  const getAttemptInfo = useCallback((email: string) => {
    return attempts.get(email.toLowerCase());
  }, [attempts]);

  const isBlocked = useCallback((email: string): { blocked: boolean; remainingTime?: number } => {
    const attemptInfo = getAttemptInfo(email);
    
    if (!attemptInfo || !attemptInfo.blockedUntil) {
      return { blocked: false };
    }

    const now = Date.now();
    if (now >= attemptInfo.blockedUntil) {
      // Le blocage a expiré, reset les tentatives
      setAttempts(prev => {
        const newAttempts = new Map(prev);
        newAttempts.delete(email.toLowerCase());
        return newAttempts;
      });
      return { blocked: false };
    }

    const remainingTime = Math.ceil((attemptInfo.blockedUntil - now) / 1000);
    return { blocked: true, remainingTime };
  }, [getAttemptInfo]);

  const recordFailedAttempt = useCallback((email: string) => {
    const emailKey = email.toLowerCase();
    const now = Date.now();

    setAttempts(prev => {
      const newAttempts = new Map(prev);
      const current = newAttempts.get(emailKey) || { 
        email: emailKey, 
        attempts: 0, 
        lastAttempt: now 
      };

      const newAttemptCount = current.attempts + 1;
      const updated: AuthAttempt = {
        ...current,
        attempts: newAttemptCount,
        lastAttempt: now
      };

      // Si on atteint le max, bloquer temporairement
      if (newAttemptCount >= MAX_ATTEMPTS) {
        const delayMultiplier = Math.min(Math.floor(newAttemptCount / MAX_ATTEMPTS), 5);
        const delay = Math.min(INITIAL_DELAY * Math.pow(2, delayMultiplier), MAX_DELAY);
        updated.blockedUntil = now + delay;
        
        console.log(`🚫 User ${email} blocked for ${delay / 1000} seconds after ${newAttemptCount} attempts`);
      }

      newAttempts.set(emailKey, updated);
      return newAttempts;
    });
  }, []);

  const recordSuccessfulAttempt = useCallback((email: string) => {
    const emailKey = email.toLowerCase();
    setAttempts(prev => {
      const newAttempts = new Map(prev);
      newAttempts.delete(emailKey);
      return newAttempts;
    });
  }, []);

  const getRemainingAttempts = useCallback((email: string): number => {
    const attemptInfo = getAttemptInfo(email);
    if (!attemptInfo) return MAX_ATTEMPTS;
    
    return Math.max(0, MAX_ATTEMPTS - attemptInfo.attempts);
  }, [getAttemptInfo]);

  return {
    isBlocked,
    recordFailedAttempt,
    recordSuccessfulAttempt,
    getRemainingAttempts,
    getAttemptInfo
  };
};
