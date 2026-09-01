import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  Terminal,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Zap,
  Cpu,
  Mail,
  Key,
  Layers,
  ArrowRight,
  Sparkles,
  QrCode,
  Globe,
  FileCode2,
  Copy,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { BorderGlow } from '@/components/react-bits/BorderGlow';
import { DecryptedText } from '@/components/react-bits/DecryptedText';
import { AnimatedBackground } from '@/components/AnimatedBackground';
import { InteractiveBentoGrid, InteractiveBentoCard } from '@/components/InteractiveBentoGrid';
import { Counter } from '@/components/react-bits/Counter';

export function ThreatAnalysisPreventionPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'vectors' | 'defense' | 'rules' | 'simulator'>('vectors');
  const [copiedRule, setCopiedRule] = useState<string | null>(null);

  // Defense Simulator States
  const [dmarcPolicy, setDmarcPolicy] = useState<'none' | 'quarantine' | 'reject'>('reject');
  const [mfaMode, setMfaMode] = useState<'sms' | 'app' | 'fido2'>('fido2');
  const [inboundScan, setInboundScan] = useState(true);
  const [quishingShield, setQuishingShield] = useState(true);

  const copyRule = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRule(id);
    setTimeout(() => setCopiedRule(null), 2000);
  };

  const threatVectors = [
    {
      id: 'quishing',
      name: 'Quishing (QR Code Phishing)',
      severity: 'CRITICAL',
      description:
        'Malicious QR codes embedded as image attachments or rendered in HTML emails designed to bypass automated gateway URL parsers and push targets to unmonitored mobile devices.',
      indicators: [
        'Image-only body payload with encoded bitmatrix',
        'Redirect through multi-hop bit.ly or Firebase Dynamic Links',
        'Lookalike login prompts requesting M365 / Okta session tokens',
      ],
      prevention: [
        'Deploy Computer Vision barcode extractors at inbound mail gateway',
        'Enforce FIDO2 WebAuthn authentication to render mobile credential harvest useless',
        'Block dynamic redirector domain patterns from untrusted external senders',
      ],
    },
    {
      id: 'aitm',
      name: 'Adversary-in-the-Middle (AitM) Proxies',
      severity: 'CRITICAL',
      description:
        'Reverse-proxy frameworks (e.g., Evilginx2, Modlishka) that proxy authentic authentication dialogues in real-time, stealing session cookies and bypassing traditional SMS/TOTP MFA.',
      indicators: [
        'Homoglyph domain or random subdomain matching trusted IDPs',
        'Absence of client certificate or device MDM compliance bindings',
        'Origin IP mismatch between initial auth packet and subsequent API calls',
      ],
      prevention: [
        'Transition all corporate accounts to FIDO2 / Passkeys hardware security tokens',
        'Enforce Conditional Access requiring Intune/MDM-managed device compliance',
        'Enable continuous token binding and anomalous IP session revocation',
      ],
    },
    {
      id: 'bec',
      name: 'Business Email Compromise (BEC & VIP Impersonation)',
      severity: 'HIGH',
      description:
        'Targeted social engineering with zero payload attachments, leveraging display-name spoofing, cousin domains, or hijacked vendor threads to request wire transfers or payroll changes.',
      indicators: [
        'Display Name matches CXO but Header From differs from envelope sender',
        'High linguistic pressure: urgent requests, secrecy requirements, unusual banking instructions',
        'Reply-To header routing to disposable or external webmail services',
      ],
      prevention: [
        'Implement strict DMARC p=reject with DKIM cryptographic alignment',
        'Enable NLP VIP display-name impersonation flags with colored warning banners',
        'Enforce out-of-band multi-party authorization for financial disbursements',
      ],
    },
    {
      id: 'brand_abuse',
      name: 'Credential Harvesting & Brand Spoofing',
      severity: 'HIGH',
      description:
        'Cloned landing pages replicating cloud providers (Microsoft 365, Google Workspace, DocuSign, FedEx) using Unicode homoglyphs and hidden zero-font obfuscation.',
      indicators: [
        'IDN homograph characters in host domain (e.g., micr0soft.com)',
        'Hidden CSS display:none layers containing clean text to confuse spam heuristics',
        'Obfuscated JavaScript payload decoding form action endpoints dynamically',
      ],
      prevention: [
        'Real-time automated domain age lookup (flagging domains < 30 days old)',
        'Automated headless browser sandbox screenshotting and DOM structure hashing',
        'Browser-level DNS threat intelligence feeds blocking emerging malicious hosts',
      ],
    },
  ];

  const socRules = [
    {
      id: 'yara-qr',
      title: 'YARA Rule: Suspicious QR Code Inbound Attachment',
      type: 'YARA',
      code: `rule Inbound_Suspicious_QR_Quishing {
    meta:
        description = "Detects emails with embedded QR code images containing external auth links"
        author = "PhishShield SOC"
        severity = "High"
    strings:
        $qr_magic = { 89 50 4E 47 0D 0A 1A 0A } // PNG header
        $s1 = "qr_code" nocase
        $s2 = "scan to verify" nocase
        $s3 = "2fa_setup" nocase
        $s4 = "authenticator_update" nocase
    condition:
        $qr_magic at 0 and 2 of ($s*) and filesize < 500KB
}`,
    },
    {
      id: 'sigma-bec',
      title: 'Sigma Rule: Executive Display Name Spoofing with External Sender',
      type: 'SIGMA',
      code: `title: Executive Display Name Mismatch in Mail Gateway
status: production
description: Detects inbound email where DisplayName matches executive list but Sender Domain is external
logsource:
    category: email
    product: m365_exchange
detection:
    selection:
        HeaderFromDisplayName|contains:
            - "Chief Executive Officer"
            - "Managing Director"
            - "Chief Financial Officer"
    filter:
        SenderDomain|endswith: "@organization.com"
    condition: selection and not filter
level: high`,
    },
    {
      id: 'snort-aitm',
      title: 'Suricata / Snort: Reverse Proxy Session Cookie Exfiltration',
      type: 'SURICATA',
      code: `alert http any any -> any any (
    msg:"ET PHISH Potential AitM Reverse-Proxy Session Intercept";
    flow:established,to_server;
    content:"POST"; http_method;
    content:"Evilginx"; nocase; http_user_agent;
    content:"session_token="; http_client_body;
    classtype:credential-theft;
    sid:2039841;
    rev:1;
)`,
    },
  ];

  return (
    <div className="w-full space-y-10 pb-16 relative">
      {/* High-contrast animated background waves with 1.0 opacity */}
      <AnimatedBackground variant="gradient-waves" opacity={1.0} />

      {/* Header Banner */}
      <div className="relative z-10">
        <BorderGlow glowColor="#6E473B" borderRadius="24px">
          <div className="p-8 sm:p-10 rounded-3xl bg-[#291C0E]/95 backdrop-blur-md text-brand-bg shadow-xl border border-brand-light/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-medium/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-4xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-medium/30 border border-brand-light/40 text-xs font-mono font-bold text-[#E1D4C2]">
                <ShieldCheck className="h-3.5 w-3.5 text-[#8ec7a4]" />
                <span>NIST SP 800-177 & MITRE ATT&CK FRAMEWORK</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white font-flaviotte">
                <DecryptedText
                  text="Threat Prevention & Security Matrix"
                  speed={35}
                  animateOn="view"
                  className="font-flaviotte"
                />
              </h1>

              <p className="text-sm sm:text-base text-[#BEB5A9] leading-relaxed font-subtext font-medium">
                Comprehensive forensic breakdown of modern social engineering attack vectors, multi-layered
                infrastructure defenses, cryptographic email authentication standards, and automated detection rule sets.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Button
                  variant="primary"
                  onClick={() => navigate('/scan')}
                  className="gap-2 bg-[#E1D4C2] text-brand-dark hover:bg-white font-bold no-underline"
                >
                  <Terminal className="h-4 w-4" />
                  <span>Test Live Telemetry in Scanner</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setActiveTab('simulator')}
                  className="gap-2 border-brand-light/40 text-[#E1D4C2] hover:bg-brand-medium/40 font-semibold no-underline"
                >
                  <Sliders className="h-4 w-4" />
                  <span>Security Posture Calculator</span>
                </Button>
              </div>
            </div>
          </div>
        </BorderGlow>
      </div>

      {/* Navigation Filter Tabs with Smooth Animation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-brand-light/40 pb-3 relative z-10">
        <button
          onClick={() => setActiveTab('vectors')}
          className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer font-flaviotte no-underline ${
            activeTab === 'vectors'
              ? 'bg-brand-dark text-white shadow-md'
              : 'bg-brand-secondary/40 text-brand-dark hover:bg-brand-secondary/70'
          }`}
        >
          <ShieldAlert className="h-4 w-4" />
          <span>Core Attack Vectors</span>
        </button>

        <button
          onClick={() => setActiveTab('defense')}
          className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer font-flaviotte no-underline ${
            activeTab === 'defense'
              ? 'bg-brand-dark text-white shadow-md'
              : 'bg-brand-secondary/40 text-brand-dark hover:bg-brand-secondary/70'
          }`}
        >
          <Lock className="h-4 w-4" />
          <span>Multi-Layer Defense Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer font-flaviotte no-underline ${
            activeTab === 'rules'
              ? 'bg-brand-dark text-white shadow-md'
              : 'bg-brand-secondary/40 text-brand-dark hover:bg-brand-secondary/70'
          }`}
        >
          <Terminal className="h-4 w-4" />
          <span>SOC Detection Rules & Signatures</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`relative px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer font-flaviotte no-underline ${
            activeTab === 'simulator'
              ? 'bg-brand-dark text-white shadow-md'
              : 'bg-brand-secondary/40 text-brand-dark hover:bg-brand-secondary/70'
          }`}
        >
          <Sliders className="h-4 w-4" />
          <span>Interactive Defense Calculator</span>
        </button>
      </div>

      {/* Dynamic Animated Tab Views with AnimatePresence */}
      <AnimatePresence mode="wait">
        {/* TAB 1: ATTACK VECTORS - Interactive Bento Grid */}
        {activeTab === 'vectors' && (
          <motion.div
            key="tab-vectors"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="space-y-6 relative z-10"
          >
            <InteractiveBentoGrid cols={2} className="gap-6">
              {threatVectors.map((vector) => (
                <InteractiveBentoCard
                  key={vector.id}
                  variant="light"
                  glowColor="#6E473B"
                  enableTilt={true}
                  enableSpotlight={true}
                  tiltIntensity={6}
                  className="p-6 flex flex-col justify-between bg-[#ebe0d1]/80 backdrop-blur-md border border-brand-light/40"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-md bg-brand-medium/20 text-brand-dark border border-brand-medium/30">
                          {vector.severity}
                        </span>
                        <h3 className="text-lg font-bold text-brand-dark mt-1.5 font-flaviotte">{vector.name}</h3>
                      </div>
                      <ShieldAlert className="h-5 w-5 text-brand-medium shrink-0" />
                    </div>

                    <p className="text-xs text-brand-dark/80 font-subtext font-medium leading-relaxed">
                      {vector.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-3 mt-4 border-t border-brand-light/40 text-xs">
                    <div>
                      <span className="font-bold text-brand-dark uppercase tracking-wider text-[10px] block mb-1.5 flex items-center gap-1">
                        <Eye className="h-3 w-3 text-brand-medium" /> Primary Forensic Indicators:
                      </span>
                      <ul className="space-y-1 text-brand-dark/75 pl-3 list-disc">
                        {vector.indicators.map((ind, i) => (
                          <li key={i} className="font-subtext">{ind}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="font-bold text-[#005a36] uppercase tracking-wider text-[10px] block mb-1.5 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#005a36]" /> Prescribed Prevention:
                      </span>
                      <ul className="space-y-1 text-brand-dark/85 pl-3 list-disc">
                        {vector.prevention.map((prev, i) => (
                          <li key={i} className="font-subtext font-medium">{prev}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </InteractiveBentoCard>
              ))}
            </InteractiveBentoGrid>
          </motion.div>
        )}

        {/* TAB 2: MULTI-LAYER DEFENSE MATRIX - Interactive Bento Grid */}
        {activeTab === 'defense' && (
          <motion.div
            key="tab-defense"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="space-y-8 relative z-10"
          >
            <InteractiveBentoGrid cols={3} className="gap-6">
              {/* Layer 1 */}
              <InteractiveBentoCard
                variant="light"
                glowColor="#6E473B"
                enableTilt={true}
                enableSpotlight={true}
                tiltIntensity={6}
                className="p-6 space-y-4 flex flex-col justify-between bg-[#ebe0d1]/80 backdrop-blur-md border border-brand-light/40"
              >
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-brand-dark text-brand-bg flex items-center justify-center">
                    <Mail className="h-5 w-5 text-[#E1D4C2]" />
                  </div>
                  <h3 className="text-base font-bold text-brand-dark font-flaviotte">1. Transport & Auth Layer</h3>
                  <p className="text-xs text-brand-dark/80 font-subtext leading-relaxed">
                    Cryptographic signature and domain alignment validation at the mail gateway before inbox delivery.
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-brand-light/30 text-xs font-subtext">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">SPF (Sender Policy Framework)</span>
                    <span className="font-mono text-[11px] font-bold text-[#005a36]">p=reject</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">DKIM (DomainKeys Identified Mail)</span>
                    <span className="font-mono text-[11px] font-bold text-[#005a36]">2048-bit RSA</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">DMARC Alignment</span>
                    <span className="font-mono text-[11px] font-bold text-[#005a36]">Strict Mode</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">BIMI Brand Certificates</span>
                    <span className="font-mono text-[11px] font-bold text-brand-medium">VMC / SVG</span>
                  </div>
                </div>
              </InteractiveBentoCard>

              {/* Layer 2 */}
              <InteractiveBentoCard
                variant="light"
                glowColor="#6E473B"
                enableTilt={true}
                enableSpotlight={true}
                tiltIntensity={6}
                className="p-6 space-y-4 flex flex-col justify-between bg-[#ebe0d1]/80 backdrop-blur-md border border-brand-light/40"
              >
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-brand-medium text-white flex items-center justify-center">
                    <Cpu className="h-5 w-5 text-[#E1D4C2]" />
                  </div>
                  <h3 className="text-base font-bold text-brand-dark font-flaviotte">2. AI Behavioral & Content Layer</h3>
                  <p className="text-xs text-brand-dark/80 font-subtext leading-relaxed">
                    Real-time deep NLP, optical barcode vision, and SHAP token attribution inspecting payloads.
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-brand-light/30 text-xs font-subtext">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Urgency & Coercion Classifier</span>
                    <span className="font-mono text-[11px] font-bold text-[#005a36]">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Optical QR Vision Decoding</span>
                    <span className="font-mono text-[11px] font-bold text-[#005a36]">Multi-hop</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Explainable Token Attribution</span>
                    <span className="font-mono text-[11px] font-bold text-brand-medium">SHAP Value</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Zero-Day Heuristic Scan</span>
                    <span className="font-mono text-[11px] font-bold text-brand-medium">Zero-Shot</span>
                  </div>
                </div>
              </InteractiveBentoCard>

              {/* Layer 3 */}
              <InteractiveBentoCard
                variant="light"
                glowColor="#6E473B"
                enableTilt={true}
                enableSpotlight={true}
                tiltIntensity={6}
                className="p-6 space-y-4 flex flex-col justify-between bg-[#ebe0d1]/80 backdrop-blur-md border border-brand-light/40"
              >
                <div className="space-y-3">
                  <div className="h-10 w-10 rounded-xl bg-brand-dark text-brand-bg flex items-center justify-center">
                    <Key className="h-5 w-5 text-[#E1D4C2]" />
                  </div>
                  <h3 className="text-base font-bold text-brand-dark font-flaviotte">3. Identity & Access Layer</h3>
                  <p className="text-xs text-brand-dark/80 font-subtext leading-relaxed">
                    Phishing-resistant authentication protocols mitigating successful credential entry and session theft.
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-brand-light/30 text-xs font-subtext">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">FIDO2 / WebAuthn Hardware Keys</span>
                    <span className="font-mono text-[11px] font-bold text-[#005a36]">Anti-AitM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Conditional Access & MDM Binding</span>
                    <span className="font-mono text-[11px] font-bold text-[#005a36]">Enforced</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Continuous Token Revocation</span>
                    <span className="font-mono text-[11px] font-bold text-brand-medium">CAE Enabled</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Step-Up Auth on Geo-Velocity</span>
                    <span className="font-mono text-[11px] font-bold text-brand-medium">Immediate</span>
                  </div>
                </div>
              </InteractiveBentoCard>
            </InteractiveBentoGrid>
          </motion.div>
        )}

        {/* TAB 3: SOC DETECTION RULES */}
        {activeTab === 'rules' && (
          <motion.div
            key="tab-rules"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="space-y-6 relative z-10"
          >
            <div className="grid grid-cols-1 gap-6">
              {socRules.map((rule) => (
                <BorderGlow key={rule.id} glowColor="#6E473B" borderRadius="20px">
                  <div className="p-6 rounded-2xl bg-[#ebe0d1]/85 backdrop-blur-md border border-brand-light/40 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-brand-light/30 pb-3">
                      <div className="flex items-center gap-2">
                        <FileCode2 className="h-5 w-5 text-brand-medium" />
                        <h3 className="font-bold text-brand-dark text-base font-flaviotte">{rule.title}</h3>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-brand-dark text-[#E1D4C2]">
                          {rule.type}
                        </span>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyRule(rule.id, rule.code)}
                        className="gap-1.5 text-xs border-brand-light/50 text-brand-dark hover:bg-white no-underline"
                      >
                        {copiedRule === rule.id ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-[#005a36]" />
                            <span className="text-[#005a36] font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Copy Rule</span>
                          </>
                        )}
                      </Button>
                    </div>

                    <pre className="text-[11px] font-mono bg-[#140e07] p-4 rounded-xl overflow-x-auto text-[#E1D4C2] leading-relaxed border border-brand-light/15">
                      {rule.code}
                    </pre>
                  </div>
                </BorderGlow>
              ))}
            </div>
          </motion.div>
        )}

        {/* TAB 4: INTERACTIVE POSTURE CALCULATOR with Dynamic Animated Counter */}
        {activeTab === 'simulator' && (
          <motion.div
            key="tab-simulator"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10"
          >
            <div className="lg:col-span-7 p-6 rounded-2xl bg-[#ebe0d1]/85 backdrop-blur-md border border-brand-light/40 space-y-6">
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-brand-dark flex items-center gap-2 font-flaviotte">
                  <Sliders className="h-5 w-5 text-brand-medium" />
                  Organizational Defense Posture Controls
                </h3>
                <p className="text-xs text-brand-dark/75 font-subtext">
                  Toggle policies to calculate your enterprise's phishing interception probability and resilience rating.
                </p>
              </div>

              <div className="space-y-4 text-xs font-subtext">
                {/* DMARC Policy */}
                <div className="p-4 rounded-xl bg-brand-bg/70 border border-brand-light/40 space-y-2">
                  <label className="font-bold text-brand-dark block">DMARC Enforcement Level:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['reject', 'quarantine', 'none'] as const).map((pol) => (
                      <button
                        key={pol}
                        onClick={() => setDmarcPolicy(pol)}
                        className={`p-2 rounded-lg font-mono font-bold capitalize transition-all border cursor-pointer ${
                          dmarcPolicy === pol
                            ? 'bg-brand-dark text-white border-brand-dark shadow-xs'
                            : 'bg-white/60 text-brand-dark border-brand-light/40 hover:bg-white'
                        }`}
                      >
                        p={pol}
                      </button>
                    ))}
                  </div>
                </div>

                {/* MFA Implementation */}
                <div className="p-4 rounded-xl bg-brand-bg/70 border border-brand-light/40 space-y-2">
                  <label className="font-bold text-brand-dark block">Authentication / MFA Architecture:</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'fido2', label: 'FIDO2 / WebAuthn (Phish-proof)' },
                      { id: 'app', label: 'Authenticator App TOTP' },
                      { id: 'sms', label: 'SMS / Email OTP' },
                    ].map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setMfaMode(m.id as any)}
                        className={`p-2 rounded-lg font-bold text-[11px] transition-all border cursor-pointer ${
                          mfaMode === m.id
                            ? 'bg-brand-dark text-white border-brand-dark shadow-xs'
                            : 'bg-white/60 text-brand-dark border-brand-light/40 hover:bg-white'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Inbound XAI Scan */}
                <div className="p-4 rounded-xl bg-brand-bg/70 border border-brand-light/40 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-brand-dark">Explainable AI Inbound Gateway Inspection</div>
                    <div className="text-[11px] text-brand-dark/70">Real-time SHAP analysis & header entropy scoring</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={inboundScan}
                    onChange={(e) => setInboundScan(e.target.checked)}
                    className="h-5 w-5 accent-brand-medium rounded cursor-pointer"
                  />
                </div>

                {/* Quishing Shield */}
                <div className="p-4 rounded-xl bg-brand-bg/70 border border-brand-light/40 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-brand-dark">Optical Computer Vision Quishing Shield</div>
                    <div className="text-[11px] text-brand-dark/70">Scans all image attachments for malicious QR links</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={quishingShield}
                    onChange={(e) => setQuishingShield(e.target.checked)}
                    className="h-5 w-5 accent-brand-medium rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Calculator Output with Counter Component */}
            <div className="lg:col-span-5 space-y-4">
              <BorderGlow glowColor="#6E473B" borderRadius="20px">
                <div className="p-6 rounded-2xl bg-brand-dark/95 backdrop-blur-md text-brand-bg border border-brand-light/30 space-y-6">
                  <div className="flex items-center justify-between border-b border-brand-light/20 pb-3">
                    <span className="text-xs font-mono font-bold text-[#BEB5A9]">CALCULATED RESILIENCE</span>
                    <span className="text-xs font-mono text-[#8ec7a4] font-bold">LIVE METRIC</span>
                  </div>

                  {/* Score Calc */}
                  {(() => {
                    let score = 30;
                    if (dmarcPolicy === 'reject') score += 25;
                    if (dmarcPolicy === 'quarantine') score += 15;
                    if (mfaMode === 'fido2') score += 25;
                    if (mfaMode === 'app') score += 12;
                    if (inboundScan) score += 10;
                    if (quishingShield) score += 10;

                    return (
                      <div className="text-center space-y-2">
                        <div className="flex items-center justify-center font-mono font-black text-white">
                          <Counter
                            value={score}
                            fontSize={54}
                            fontWeight={900}
                            textColor="#FFFFFF"
                            gap={2}
                          />
                          <span className="text-4xl text-[#E1D4C2] font-mono ml-1">%</span>
                        </div>
                        <div className="text-xs font-bold uppercase tracking-wider text-[#8ec7a4]">
                          {score >= 85 ? 'High Enterprise Defense Grade' : score >= 60 ? 'Moderate Protection' : 'Vulnerable Posture'}
                        </div>
                        <p className="text-[11px] text-[#BEB5A9] font-subtext pt-2 leading-relaxed">
                          {score >= 85
                            ? 'Your infrastructure enforces phish-resistant MFA and strict DMARC rejection, preventing 99% of automated BEC and AitM attacks.'
                            : 'Weak MFA or permissive DMARC policies leave users susceptible to reverse-proxy AitM cookie hijacking and executive spoofing.'}
                        </p>
                      </div>
                    );
                  })()}

                  <div className="pt-4 border-t border-brand-light/20">
                    <Button
                      variant="primary"
                      onClick={() => navigate('/scan')}
                      className="w-full bg-[#E1D4C2] text-brand-dark hover:bg-white font-bold no-underline cursor-pointer"
                    >
                      <span>Run Verification Scan</span>
                      <ArrowRight className="h-4 w-4 ml-1.5" />
                    </Button>
                  </div>
                </div>
              </BorderGlow>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ThreatAnalysisPreventionPage;
