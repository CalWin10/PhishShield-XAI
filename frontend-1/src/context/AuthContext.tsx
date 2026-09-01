import React, { createContext, useContext, useState, useEffect } from 'react';

export type UserRole = 'TIER_1_ANALYST' | 'SENIOR_THREAT_HUNTER' | 'INCIDENT_COMMANDER' | 'SECOPS_ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleTitle: string;
  badgeId: string;
  clearanceLevel: 'LEVEL_3_SECRET' | 'LEVEL_4_TOP_SECRET' | 'LEVEL_5_EXECUTIVE';
  avatarInitials: string;
  lastLogin: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  login: (email: string, role: UserRole, name?: string) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const DEFAULT_USER: UserProfile = {
  id: 'usr_8829_certin',
  name: 'Mihil Shantha Nivash',
  email: 'mihil.shanthanivash@cyberdefense.gov.in',
  role: 'SENIOR_THREAT_HUNTER',
  roleTitle: 'Senior Threat Hunter & ML Triage',
  badgeId: 'CERT-IN-8892-HQ',
  clearanceLevel: 'LEVEL_4_TOP_SECRET',
  avatarInitials: 'MS',
  lastLogin: new Date().toISOString(),
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('phishshield_auth_user');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_USER;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('phishshield_auth_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('phishshield_auth_user');
    }
  }, [user]);

  const login = async (email: string, role: UserRole, name?: string) => {
    const roleTitles: Record<UserRole, { title: string; clearance: UserProfile['clearanceLevel'] }> = {
      TIER_1_ANALYST: { title: 'Tier 1 Triage Analyst', clearance: 'LEVEL_3_SECRET' },
      SENIOR_THREAT_HUNTER: { title: 'Senior Threat Hunter & ML Triage', clearance: 'LEVEL_4_TOP_SECRET' },
      INCIDENT_COMMANDER: { title: 'SOC Incident Commander', clearance: 'LEVEL_5_EXECUTIVE' },
      SECOPS_ADMIN: { title: 'SecOps Administrator', clearance: 'LEVEL_5_EXECUTIVE' },
    };

    const userName = name || email.split('@')[0].replace('.', ' ').toUpperCase();
    const initials = userName
      .split(' ')
      .map((w) => w[0])
      .slice(0, 2)
      .join('');

    const newUser: UserProfile = {
      id: `usr_${Math.floor(1000 + Math.random() * 9000)}_xai`,
      name: userName,
      email,
      role,
      roleTitle: roleTitles[role].title,
      badgeId: `SOC-${Math.floor(1000 + Math.random() * 9000)}-${role.slice(0, 3)}`,
      clearanceLevel: roleTitles[role].clearance,
      avatarInitials: initials || 'AN',
      lastLogin: new Date().toISOString(),
    };

    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (role: UserRole) => {
    if (!user) return;
    const roleTitles: Record<UserRole, { title: string; clearance: UserProfile['clearanceLevel'] }> = {
      TIER_1_ANALYST: { title: 'Tier 1 Triage Analyst', clearance: 'LEVEL_3_SECRET' },
      SENIOR_THREAT_HUNTER: { title: 'Senior Threat Hunter & ML Triage', clearance: 'LEVEL_4_TOP_SECRET' },
      INCIDENT_COMMANDER: { title: 'SOC Incident Commander', clearance: 'LEVEL_5_EXECUTIVE' },
      SECOPS_ADMIN: { title: 'SecOps Administrator', clearance: 'LEVEL_5_EXECUTIVE' },
    };

    setUser({
      ...user,
      role,
      roleTitle: roleTitles[role].title,
      clearanceLevel: roleTitles[role].clearance,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        switchRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
