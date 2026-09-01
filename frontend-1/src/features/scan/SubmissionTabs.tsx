import React, { useState } from 'react';
import { Mail, Globe, UploadCloud, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { EmailScanRequest, ScanMode, UrlScanRequest } from '@/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { EmailScanForm } from './EmailScanForm';
import { UrlScanForm } from './UrlScanForm';
import { EmlUploader } from './EmlUploader';
import { BorderGlow } from '@/components/react-bits/BorderGlow';

export interface SubmissionTabsProps {
  onScanEmail?: (data: EmailScanRequest) => void;
  onScanUrl?: (data: UrlScanRequest) => void;
  onScanEml?: (file: File, mode: ScanMode) => void;
  onEmailSubmit?: (data: EmailScanRequest) => void;
  onUrlSubmit?: (data: UrlScanRequest) => void;
  onEmlSubmit?: (file: File, mode: ScanMode) => void;
  isLoading?: boolean;
  isSubmitting?: boolean;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}

export function SubmissionTabs({
  onScanEmail,
  onScanUrl,
  onScanEml,
  onEmailSubmit,
  onUrlSubmit,
  onEmlSubmit,
  isLoading = false,
  isSubmitting = false,
  activeTab = 'email',
  onTabChange,
}: SubmissionTabsProps) {
  const [tab, setTab] = useState(activeTab);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50, rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const rotateY = ((e.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 2;
    const rotateX = -((e.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * 2;
    setMousePos({ x, y, rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 50, y: 50, rotateX: 0, rotateY: 0 });
  };

  const handleTabChange = (val: string) => {
    setTab(val);
    onTabChange?.(val);
  };

  const handleEmail = onScanEmail || onEmailSubmit || (() => {});
  const handleUrl = onScanUrl || onUrlSubmit || (() => {});
  const handleEml = onScanEml || onEmlSubmit || (() => {});
  const busy = isLoading || isSubmitting;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative transition-transform duration-200 ease-out will-change-transform"
      style={{
        transform: `perspective(1000px) rotateX(${mousePos.rotateX}deg) rotateY(${mousePos.rotateY}deg)`,
      }}
    >
      {/* Interactive Cursor Spotlight Glow */}
      <div
        className="pointer-events-none absolute -inset-2 rounded-3xl opacity-40 blur-xl transition-opacity duration-300"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}% ${mousePos.y}%, rgba(110, 71, 59, 0.45), rgba(167, 141, 120, 0.15) 50%, transparent 80%)`,
        }}
        aria-hidden="true"
      />

      <BorderGlow glowColor="#6E473B" borderRadius="20px">
        <Card className="border-brand-light/40 bg-[#ebe0d1]/90 backdrop-blur-md shadow-lg overflow-hidden rounded-2xl relative z-10">
          <CardHeader className="pb-4 border-b border-brand-light/30 bg-[#dfd0bd]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <CardTitle className="text-xl font-bold text-brand-dark flex items-center gap-2 font-flaviotte">
                  <Shield className="h-5 w-5 text-brand-medium" />
                  Triage & Threat Ingestion Console
                </CardTitle>
                <CardDescription className="text-brand-dark/80 text-xs mt-0.5 font-subtext font-medium">
                  Submit artifacts for explainable neural inspection and real-time risk scoring
                </CardDescription>
              </div>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-medium/20 text-brand-dark border border-brand-medium/30 self-start sm:self-auto">
                CURSOR SYNCED
              </span>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <Tabs value={tab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-6 bg-brand-secondary/60">
                <TabsTrigger value="email" className="gap-2 font-subtext font-semibold cursor-pointer">
                  <Mail className="h-4 w-4" />
                  <span>Email Content</span>
                </TabsTrigger>
                <TabsTrigger value="url" className="gap-2 font-subtext font-semibold cursor-pointer">
                  <Globe className="h-4 w-4" />
                  <span>Target URL</span>
                </TabsTrigger>
                <TabsTrigger value="eml" className="gap-2 font-subtext font-semibold cursor-pointer">
                  <UploadCloud className="h-4 w-4" />
                  <span>EML File</span>
                </TabsTrigger>
              </TabsList>

              <AnimatePresence mode="wait">
                {tab === 'email' && (
                  <motion.div
                    key="email-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                  >
                    <EmailScanForm onSubmit={handleEmail} isSubmitting={busy} />
                  </motion.div>
                )}

                {tab === 'url' && (
                  <motion.div
                    key="url-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                  >
                    <UrlScanForm onSubmit={handleUrl} isSubmitting={busy} />
                  </motion.div>
                )}

                {tab === 'eml' && (
                  <motion.div
                    key="eml-tab"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18, ease: 'easeOut' }}
                  >
                    <EmlUploader onSubmit={handleEml} isSubmitting={busy} />
                  </motion.div>
                )}
              </AnimatePresence>
            </Tabs>
          </CardContent>
        </Card>
      </BorderGlow>
    </div>
  );
}

export default SubmissionTabs;
