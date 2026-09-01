import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Shield,
  Lock,
  KeyRound,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Fingerprint,
  Radio,
  ArrowRight,
} from 'lucide-react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { DecryptedText } from '@/components/react-bits/DecryptedText';
import { BorderGlow } from '@/components/react-bits/BorderGlow';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function LoginPage() {
  const navigate = useNavigate();
  const { user, login, logout, isAuthenticated } = useAuth();

  const [email, setEmail] = useState('mihil.shanthanivash@cyberdefense.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('SENIOR_THREAT_HUNTER');
  const [mfaCode, setMfaCode] = useState('849-201');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const roles: { role: UserRole; title: string; clearance: string; desc: string; name: string }[] = [
    {
      role: 'TIER_1_ANALYST',
      name: 'Calwin Samuel',
      title: 'Tier 1 Triage Analyst (Cyber Defense Hub)',
      clearance: 'LEVEL 3 - SECRET',
      desc: 'Rapid email ingestion, banking scam heuristics, and live triage tagging.',
    },
    {
      role: 'SENIOR_THREAT_HUNTER',
      name: 'Mihil Shantha Nivash',
      title: 'Senior Threat Hunter & ML Triage (CERT-In Lead)',
      clearance: 'LEVEL 4 - TOP SECRET',
      desc: 'Deep forensic inspection, SHAP token analysis, and explainable neural feedback.',
    },
    {
      role: 'INCIDENT_COMMANDER',
      name: 'Sabari Ganesh',
      title: 'SOC Incident Commander (National Grid Operations)',
      clearance: 'LEVEL 5 - EXECUTIVE',
      desc: 'Automated perimeter containment, SOAR playbooks, and threat notifications.',
    },
    {
      role: 'SECOPS_ADMIN',
      name: 'Anandh Prakash',
      title: 'SecOps Infrastructure Administrator',
      clearance: 'LEVEL 5 - EXECUTIVE',
      desc: 'High-availability cluster health, XAI model gateways, and global rule tuning.',
    },
  ];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const activePersona = roles.find((r) => r.role === selectedRole);
      await login(email, selectedRole, activePersona?.name);
      setSuccess(true);
      setTimeout(() => {
        navigate('/scan');
      }, 800);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleQuickSelect = (r: UserRole) => {
    setSelectedRole(r);
    if (r === 'TIER_1_ANALYST') setEmail('calwin.samuel@triage.cyberdefense.gov.in');
    if (r === 'SENIOR_THREAT_HUNTER') setEmail('mihil.shanthanivash@cyberdefense.gov.in');
    if (r === 'INCIDENT_COMMANDER') setEmail('sabari.ganesh@cert-in.gov.in');
    if (r === 'SECOPS_ADMIN') setEmail('anandh.prakash@phishshield.in');
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto py-6 sm:py-8 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-brand-dark tracking-tight font-flaviotte">
          SecOps Identity & Clearance
        </h1>
        <p className="text-base sm:text-lg text-brand-dark/80 font-subtext font-medium leading-relaxed">
          Select an Indian SOC persona or authenticate to access threat intelligence telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Login Form */}
        <div className="lg:col-span-7">
          <BorderGlow glowColor="#6E473B" borderRadius="20px">
            <Card className="border-brand-light/40 bg-[#ebe0d1] shadow-md rounded-2xl overflow-hidden">
              <CardHeader className="border-b border-brand-light/30 bg-[#dfd0bd] pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-bold text-brand-dark flex items-center gap-2 font-flaviotte">
                    <KeyRound className="h-5 w-5 text-brand-medium" />
                    <span>Analyst Credential Portal</span>
                  </CardTitle>
                  <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[#d6edde] text-[#005a36] border border-[#8ec7a4]">
                    2FA Verified
                  </span>
                </div>
                <CardDescription className="text-sm text-brand-dark/80 font-subtext">
                  Sign in with verified Indian cyber defense credentials.
                </CardDescription>
              </CardHeader>

              <CardContent className="pt-6">
                {success ? (
                  <div className="py-8 text-center space-y-3">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#d6edde] text-[#005a36]">
                      <CheckCircle2 className="h-8 w-8" />
                    </div>
                    <h3 className="text-xl font-bold text-brand-dark font-flaviotte">Clearance Verified</h3>
                    <p className="text-sm text-brand-dark/70 font-mono">
                      Redirecting to Threat Ingestion Console...
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-sm font-bold uppercase tracking-wider text-brand-dark/80 block font-subtext">
                        Analyst Email / Gov ID
                      </label>
                      <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="bg-white/80 font-mono text-sm border-brand-light/50 h-11"
                        placeholder="analyst@domain.in"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-bold uppercase tracking-wider text-brand-dark/80 block font-subtext">
                        Security Passphrase
                      </label>
                      <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="bg-white/80 font-mono text-sm border-brand-light/50 h-11"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-bold uppercase tracking-wider text-brand-dark/80 block font-subtext">
                          Hardware Token / TOTP 2FA
                        </label>
                        <span className="text-xs text-[#005a36] font-mono font-bold">TOKEN SYNCED</span>
                      </div>
                      <Input
                        type="text"
                        value={mfaCode}
                        onChange={(e) => setMfaCode(e.target.value)}
                        className="bg-white/80 font-mono text-sm text-center tracking-widest font-bold border-brand-light/50 h-11"
                      />
                    </div>

                    <div className="pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={isLoading}
                        className="w-full gap-2 font-bold text-base h-12"
                      >
                        <UserCheck className="h-5 w-5" />
                        <span>Authenticate & Enter SOC Session</span>
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </BorderGlow>
        </div>

        {/* Right: Active Role Persona Selector */}
        <div className="lg:col-span-5 space-y-4">
          <BorderGlow glowColor="#A78D78" borderRadius="18px">
            <div className="p-5 rounded-2xl border border-brand-light/40 bg-[#ebe0d1] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-brand-dark font-subtext">
                  Quick-Select SOC Persona
                </h3>
                <span className="text-xs font-mono text-brand-dark/60">Indian SOC Team</span>
              </div>

              <div className="space-y-2.5">
                {roles.map((r) => {
                  const isSelected = selectedRole === r.role;
                  return (
                    <div
                      key={r.role}
                      onClick={() => handleRoleQuickSelect(r.role)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'bg-brand-dark text-white border-brand-dark shadow-md'
                          : 'bg-brand-bg/60 border-brand-light/40 hover:bg-brand-secondary/40 text-brand-dark'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold font-flaviotte">{r.name}</span>
                        <span
                          className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded ${
                            isSelected ? 'bg-brand-medium text-white' : 'bg-brand-secondary/60 text-brand-dark'
                          }`}
                        >
                          {r.clearance}
                        </span>
                      </div>
                      <div className={`text-xs font-semibold mt-1 ${isSelected ? 'text-[#E1D4C2]' : 'text-brand-dark/80'}`}>
                        {r.title}
                      </div>
                      <p
                        className={`text-xs mt-1.5 line-clamp-2 leading-relaxed font-subtext ${
                          isSelected ? 'text-[#BEB5A9]' : 'text-brand-dark/70'
                        }`}
                      >
                        {r.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </BorderGlow>

          {/* Current Active User Badge */}
          {isAuthenticated && user && (
            <div className="p-5 rounded-2xl border border-[#8ec7a4] bg-[#d6edde]/80 text-[#005a36] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#005a36] flex items-center gap-1.5 font-subtext">
                  <CheckCircle2 className="h-4 w-4 text-[#005a36]" />
                  Active SOC Session
                </span>
                <span className="font-mono text-xs bg-[#c1e4cb] px-2.5 py-0.5 rounded text-[#005a36] font-bold">
                  {user.badgeId}
                </span>
              </div>
              <div className="space-y-0.5 font-subtext">
                <div className="font-bold text-[#005a36] text-base">{user.name}</div>
                <div className="text-[#005a36]/80 font-mono text-xs">{user.email}</div>
                <div className="text-[#005a36] font-semibold text-xs pt-1">{user.roleTitle}</div>
              </div>
              <div className="pt-2 flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/scan')}
                  className="w-full text-xs font-semibold border-[#005a36]/40 text-[#005a36] hover:bg-[#c1e4cb] gap-1.5 font-subtext h-10"
                >
                  <span>Go to Threat Ingestion Scanner</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
