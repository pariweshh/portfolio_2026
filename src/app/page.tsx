"use client";
import { useState, useEffect } from "react";
import { AnimatePresence } from "motion/react";
import LoadingScreen from "@/components/LoadingScreen";
import HomePage from "@/components/HomePage";
import ProjectPage from "@/components/ProjectPage";

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // Quick fix for hydration issues if any due to AnimatePresence
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      {!isLoading && (
        <AnimatePresence mode="wait">
          {currentPage === 0 ? (
            <HomePage key="home" onNextPage={() => setCurrentPage(1)} />
          ) : (
            <ProjectPage key="project1" onBack={() => setCurrentPage(0)} />
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
