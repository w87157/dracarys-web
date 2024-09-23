import { createContext, useContext, useEffect, useState } from "react";

///// 建立與導出context
const VoteContext = createContext(null);


export function VoteProvider({ children }) {
  const storageKey = 'DNS_art_vote';

  const [votedArtwork, setVotedArtwork] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedVote = localStorage.getItem(storageKey);
      if (savedVote) {
        try {
          return JSON.parse(savedVote);
        } catch (error) {
          console.error("Error parsing saved vote:", error);
          return null;
        }
      }
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleVote = (artwork) => {
    setVotedArtwork(artwork);
    localStorage.setItem(storageKey, JSON.stringify(artwork));
  };

  // 檢查有否投過票
  const hasVoted = () => {
    return votedArtwork !== null;
  };

  // 獲取已投票的作品
  const getVotedArtwork = () => {
    return votedArtwork;
  };

  return (
    <VoteContext.Provider
      value={{
        votedArtwork,
        isLoading,
        handleVote,
        hasVoted,
        getVotedArtwork,
      }}
    >
      {children}
    </VoteContext.Provider>
  )
}


export const useVote = () => useContext(VoteContext);
