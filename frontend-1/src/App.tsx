import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { HomePage } from '@/pages/HomePage';
import { ScanPage } from '@/pages/ScanPage';
import { AnalysisPage } from '@/pages/AnalysisPage';
import { HistoryPage } from '@/pages/HistoryPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { LoginPage } from '@/pages/LoginPage';
import { ThreatAnalysisPreventionPage } from '@/pages/ThreatAnalysisPreventionPage';
import { Shield } from 'lucide-react';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-brand-bg text-brand-dark selection:bg-brand-medium selection:text-white">
          {/* Hamburger-Powered Navigation Bar */}
          <Navbar />

          {/* Main Content Area - Full-Width Responsive */}
          <main className="flex-1 w-full px-3 sm:px-6 lg:px-8 xl:px-10 pt-4 pb-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/prevention" element={<ThreatAnalysisPreventionPage />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/analyses/:analysisId" element={<AnalysisPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Footer - Full Width Responsive */}
          <footer className="border-t border-brand-light/30 bg-[#ded0bd]/90 py-6 mt-auto text-xs text-brand-dark/75 relative z-10">
            <div className="w-full px-3 sm:px-6 lg:px-8 xl:px-10 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <Shield className="h-4 w-4 text-brand-medium" />
                <span className="font-bold text-brand-dark tracking-tight">PhishShield XAI Forensic Engine</span>
                <span className="hidden sm:inline text-brand-dark/70">• Multi-layer Threat Intelligence</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-mono text-[11px] text-brand-dark/80">API Contract: /api/v1</span>
                <span className="font-mono text-[11px] bg-brand-secondary/60 text-brand-dark px-2.5 py-0.5 rounded font-bold border border-brand-light/40">
                  v3.4-prod
                </span>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
