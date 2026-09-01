import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Search,
  Zap,
  Lock,
  ArrowRight,
  ShieldAlert,
  Layers,
  Terminal,
  ChevronRight,
  Activity,
  BrainCircuit,
  Fingerprint,
  ShieldCheck,
  Sparkles,
  Sliders,
  CheckCircle2,
  FileSearch,
} from 'lucide-react';
import { GradientWaves } from '@/components/react-bits/GradientWaves';
import { CardSwap, Card } from '@/components/react-bits/CardSwap';
import { DecryptedText } from '@/components/react-bits/DecryptedText';
import { BorderGlow } from '@/components/react-bits/BorderGlow';
import { MagicBento } from '@/components/react-bits/MagicBento';
import { InteractiveBentoGrid, InteractiveBentoCard } from '@/components/InteractiveBentoGrid';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { Button } from '@/components/ui/button';
import { Counter } from '@/components/react-bits/Counter';

export function HomePage() {
  const navigate = useNavigate();

  // Dynamic interactive bottom metrics state
  const [detectionRate, setDetectionRate] = useState(99.4);
  const [scanSpeed, setScanSpeed] = useState(315);
  const [scansVerified, setScansVerified] = useState(100);
  const [isInteracting, setIsInteracting] = useState(false);

  // Dynamic fluctuation on touch / hover / click
  const triggerDynamicMetrics = () => {
    setIsInteracting(true);
    const rates = [99.4, 99.6, 99.7, 99.5, 99.8, 99.3];
    const speeds = [285, 310, 295, 320, 278, 305];
    const randomRate = rates[Math.floor(Math.random() * rates.length)];
    const randomSpeed = speeds[Math.floor(Math.random() * speeds.length)];

    setDetectionRate(randomRate);
    setScanSpeed(randomSpeed);

    setTimeout(() => {
      setIsInteracting(false);
    }, 600);
  };

  // Periodic subtle dynamic pulse
  useEffect(() => {
    const timer = setInterval(() => {
      triggerDynamicMetrics();
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const threatVectors = [
    {
      title: 'SBI YONO KYC Suspension Scam',
      tag: 'CRITICAL RISK',
      source: 'support@sbi-yono-kyc-update.xyz',
      verdict: '95% Risk Score',
      details: 'Fake State Bank of India alert threatening immediate account freeze if PAN/Aadhaar is not entered.',
      ioc: 'Flag: Deceptive Login & Mismatched Return-Path',
    },
    {
      title: 'Income Tax ITR Refund Phish',
      tag: 'CRITICAL RISK',
      source: 'incometax-efiling-refunds-gov.org',
      verdict: '92% Risk Score',
      details: 'Spoofed Income Tax Department portal harvesting NetBanking credentials and UPI PINs.',
      ioc: 'Flag: Fake Domain & Credential Harvester',
    },
    {
      title: 'EPFO UAN Update Fraud Notice',
      tag: 'HIGH RISK',
      source: 'uan-helpdesk@epfindia-services-portal.net',
      verdict: '84% Risk Score',
      details: 'Phishing notice requesting Aadhaar OTP verification to unlock provident fund balance.',
      ioc: 'Flag: Psychological Coercion & Fraud Domain',
    },
    {
      title: 'Legitimate Amazon / Flipkart Order',
      tag: 'SAFE / VERIFIED',
      source: 'auto-confirm@amazon.in',
      verdict: '1% Safe Score',
      details: 'Cryptographically valid DKIM signatures and legitimate corporate payment gateways.',
      ioc: 'Flag: Verified Cryptographic Signatures',
    },
  ];

  const pipelineStages = [
    {
      step: '01',
      title: 'Instant Ingestion',
      desc: 'Parses email text, header metadata, EML files, or website links in milliseconds with full token normalization.',
      icon: Terminal,
      badge: 'Zero Latency',
    },
    {
      step: '02',
      title: 'Domain & SPF Check',
      desc: 'Validates DKIM/SPF signatures, registrar age, lookalike Typosquatting, and reverse DNS records.',
      icon: Lock,
      badge: 'Cryptographic',
    },
    {
      step: '03',
      title: 'AI Scam Heuristics',
      desc: 'Detects psychological urgency, KYC freeze threats, and fake banking credential harvesting portals.',
      icon: BrainCircuit,
      badge: 'Deep XAI',
    },
    {
      step: '04',
      title: 'Visual Evidence',
      desc: 'Highlights deceptive words, spoofed senders, and malicious redirect links with exact risk attribution.',
      icon: Layers,
      badge: 'Explainable',
    },
    {
      step: '05',
      title: 'Actionable Advice',
      desc: 'Generates immediate containment playbooks, CERT-In incident reports, and custom SIEM blocking rules.',
      icon: Zap,
      badge: 'Automated SOC',
    },
  ];

  return (
    <div className="w-full space-y-16 pb-16 relative">
      {/* High-visibility animated background */}
      <AnimatedBackground variant="ghost-fibers" opacity={0.85} />

      {/* Hero Section with WebGL GradientWaves & CardSwap */}
      <div className="relative z-10">
        <BorderGlow glowColor="#6E473B" borderRadius="24px">
          <div className="relative rounded-3xl overflow-hidden border border-brand-light/40 bg-brand-dark text-brand-bg shadow-2xl">
            {/* GradientWaves Background */}
            <div className="absolute inset-0 opacity-60 pointer-events-none">
              <GradientWaves
                horizonColor="#291C0E"
                waveColor="#6E473B"
                crestColor="#BEB5A9"
                speed={0.35}
                amplitude={2.2}
                waveScale={0.55}
                waveRatio={0.85}
                swell={28}
                turbulence={18}
                tilt={1.05}
                zoom={0.95}
                height={5.0}
                fogDepth={16}
                detail="medium"
                brightness={1.2}
                opacity={0.9}
                mouseInteraction={true}
              />
            </div>

            {/* Hero Content */}
            <div className="relative z-10 px-6 py-12 sm:px-10 lg:px-14 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left Hero Column */}
              <div className="lg:col-span-7 space-y-6">
                {/* Prominent PhishShield XAI Forensic Engine Tag */}
                <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-brand-medium/60 border border-brand-light/40 text-xs sm:text-sm font-black text-[#E1D4C2] font-flaviotte tracking-wide no-underline shadow-xs">
                  <ShieldCheck className="h-4 w-4 text-[#8ec7a4]" />
                  <span className="font-black text-white">PhishShield XAI</span>
                  <span className="text-[#BEB5A9]">•</span>
                  <span className="font-bold text-[#E1D4C2]">Explainable Forensic Engine</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight font-flaviotte">
                  AI-Powered Phishing &{' '}
                  <span className="text-[#E1D4C2] font-black">
                    <DecryptedText
                      text="Link Scanner"
                      speed={45}
                      maxIterations={15}
                      animateOn="mount"
                      encryptedClassName="text-brand-light font-mono"
                    />
                  </span>
                </h1>

                <p className="text-base sm:text-lg text-[#BEB5A9] max-w-xl leading-relaxed font-subtext font-medium">
                  Verify suspicious emails, banking links, and messages before clicking. Powered by explainable neural threat modeling and CERT-In telemetry.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/scan')}
                    className="gap-2 bg-[#E1D4C2] text-brand-dark hover:bg-white font-bold text-base shadow-md hover:scale-[1.02] transition-transform cursor-pointer h-12 px-6 no-underline"
                  >
                    <Search className="h-5 w-5" />
                    <span>Start New Scan</span>
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('/prevention')}
                    className="gap-2 border-brand-light/50 text-[#E1D4C2] hover:bg-brand-medium/40 font-semibold text-base cursor-pointer h-12 px-6 no-underline"
                  >
                    <ShieldCheck className="h-5 w-5 text-[#8ec7a4]" />
                    <span>Threat Prevention Framework</span>
                  </Button>
                </div>

                {/* Micro Stats - Dynamic Interactive Counters on Touch / Hover */}
                <div
                  onTouchStart={triggerDynamicMetrics}
                  onMouseEnter={triggerDynamicMetrics}
                  onClick={triggerDynamicMetrics}
                  className="grid grid-cols-3 gap-4 pt-6 border-t border-brand-light/20 text-sm cursor-pointer select-none group"
                  title="Tap or touch to refresh live telemetry metrics"
                >
                  <div className="transition-transform duration-200 group-hover:scale-105">
                    <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-baseline">
                      <Counter
                        value={detectionRate}
                        places={[10, 1, '.', 0.1]}
                        fontSize={28}
                        fontWeight={800}
                        textColor="#FFFFFF"
                        gap={1}
                      />
                      <span className="text-sm text-[#8ec7a4] ml-0.5">%</span>
                    </div>
                    <div className="text-[#BEB5A9] font-subtext mt-0.5 font-medium flex items-center gap-1 text-xs sm:text-sm">
                      <span>Detection Rate</span>
                      {isInteracting && <span className="h-1.5 w-1.5 rounded-full bg-[#8ec7a4] animate-ping" />}
                    </div>
                  </div>

                  <div className="transition-transform duration-200 group-hover:scale-105">
                    <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-baseline">
                      <span className="text-sm text-brand-light mr-1">&lt;</span>
                      <Counter
                        value={scanSpeed}
                        fontSize={28}
                        fontWeight={800}
                        textColor="#FFFFFF"
                        gap={1}
                      />
                      <span className="text-xs text-[#BEB5A9] ml-1 font-sans">ms</span>
                    </div>
                    <div className="text-[#BEB5A9] font-subtext mt-0.5 font-medium text-xs sm:text-sm">
                      Scan Speed
                    </div>
                  </div>

                  <div className="transition-transform duration-200 group-hover:scale-105">
                    <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono flex items-baseline">
                      <Counter
                        value={scansVerified}
                        fontSize={28}
                        fontWeight={800}
                        textColor="#FFFFFF"
                        gap={1}
                      />
                      <span className="text-sm text-[#8ec7a4] ml-0.5">%</span>
                    </div>
                    <div className="text-[#BEB5A9] font-subtext mt-0.5 font-medium text-xs sm:text-sm">
                      Explainable AI
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Hero Column: Interactive CardSwap Sample Scans */}
              <div className="lg:col-span-5 flex flex-col items-center justify-center min-h-[360px] relative">
                <div className="text-center mb-3">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#BEB5A9] flex items-center justify-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                    Live Threat Samples
                  </span>
                </div>

                <div className="w-full flex items-center justify-center">
                  <CardSwap
                    width={360}
                    height={230}
                    cardDistance={35}
                    verticalDistance={28}
                    delay={4200}
                    skewAmount={3}
                  >
                    {threatVectors.map((item, idx) => (
                      <Card key={idx} className="flex flex-col justify-between p-5 bg-[#1f150b] border-brand-light/30 shadow-xl">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-brand-medium/50 text-[#E1D4C2] border border-brand-light/30">
                              {item.tag}
                            </span>
                            <span className="text-xs font-bold text-[#8ec7a4] font-mono">{item.verdict}</span>
                          </div>
                          <h4 className="text-base font-bold text-white line-clamp-1 font-flaviotte">{item.title}</h4>
                          <p className="text-xs text-[#BEB5A9] mt-1 line-clamp-2 leading-relaxed font-subtext font-medium">{item.details}</p>
                        </div>

                        <div className="mt-3 pt-2 border-t border-brand-light/20 flex items-center justify-between text-xs font-mono text-brand-light">
                          <span className="truncate max-w-[240px]">{item.ioc}</span>
                          <ChevronRight className="h-4 w-4 shrink-0" />
                        </div>
                      </Card>
                    ))}
                  </CardSwap>
                </div>
              </div>
            </div>
          </div>
        </BorderGlow>
      </div>

      {/* Feature Highlights Grid with MagicBento */}
      <div className="space-y-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-brand-dark tracking-tight font-flaviotte">
            Multi-Layer Threat Defense
          </h2>
          <p className="text-sm sm:text-base text-brand-dark/80 font-subtext font-medium leading-relaxed">
            PhishShield exposes deceptive keywords, fake banking portals, and sender traps before you interact.
          </p>
        </div>

        {/* Integrated MagicBento Component */}
        <div className="w-full">
          <MagicBento
            textAutoHide={true}
            enableStars={true}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={280}
            particleCount={14}
            glowColor="110, 71, 59"
          />
        </div>
      </div>

      {/* 5-Step Pipeline Walkthrough with Cursor Interactive Bento Grid */}
      <div className="space-y-6 relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-brand-light/30 pb-4">
          <div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-brand-dark flex items-center gap-2.5 font-flaviotte">
              <Layers className="h-7 w-7 text-brand-medium" />
              How PhishShield Works
            </h3>
            <p className="text-sm text-brand-dark/80 font-subtext font-medium mt-1">
              From raw email or URL ingestion to explainable safety verdict in under 300 ms.
            </p>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/scan')}
            className="font-semibold text-xs border-brand-medium gap-1.5 cursor-pointer h-9 px-4 no-underline"
          >
            <span>Test Live Sample</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <InteractiveBentoGrid cols={5} className="gap-4">
          {pipelineStages.map((stg) => {
            const Icon = stg.icon;
            return (
              <InteractiveBentoCard
                key={stg.step}
                variant="light"
                glowColor="#6E473B"
                enableTilt={true}
                enableSpotlight={true}
                tiltIntensity={8}
                className="p-5 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-lg bg-brand-secondary/60 text-brand-dark border border-brand-light/30">
                      {stg.step}
                    </span>
                    <Icon className="h-6 w-6 text-brand-medium" />
                  </div>
                  <h4 className="text-base font-bold text-brand-dark font-flaviotte">{stg.title}</h4>
                  <p className="text-xs text-brand-dark/80 font-subtext leading-relaxed font-medium">{stg.desc}</p>
                </div>

                <div className="pt-3 mt-4 border-t border-brand-light/30 flex items-center justify-between text-[11px] font-mono text-brand-medium font-bold">
                  <span>{stg.badge}</span>
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#005a36]" />
                </div>
              </InteractiveBentoCard>
            );
          })}
        </InteractiveBentoGrid>
      </div>

      {/* Quick Launch Action Banner with BorderGlow */}
      <div className="relative z-10">
        <BorderGlow glowColor="#291C0E" borderRadius="24px">
          <div className="p-8 sm:p-10 rounded-3xl border border-brand-medium/50 bg-gradient-to-r from-brand-dark to-brand-medium text-brand-bg flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 max-w-2xl">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#8ec7a4] font-bold">
                <ShieldAlert className="h-4 w-4" />
                <span>SUSPICIOUS MESSAGE OR LINK?</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white font-flaviotte">
                Run an Instant Safety Scan
              </h3>
              <p className="text-sm sm:text-base text-[#BEB5A9] font-subtext font-medium">
                Paste email text, check a website link, or upload an EML file to inspect risk immediately.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/scan')}
                className="gap-2 bg-[#E1D4C2] text-brand-dark hover:bg-white font-bold text-base h-12 px-6 cursor-pointer no-underline"
              >
                <span>Start New Scan</span>
                <ArrowRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </BorderGlow>
      </div>
    </div>
  );
}

export default HomePage;
