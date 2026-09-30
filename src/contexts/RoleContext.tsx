import React, { createContext, useContext, useState, useEffect } from 'react';
import { DISTRICT_PANCHAYATS, PanchayatRecord } from '../services/governanceIntelligenceService';

export type GovernanceRole = 'panchayat_officer' | 'agriculture_expert' | 'district_officer';

export interface RolePermissions {
  canViewEntireDistrict: boolean;
  canEditAdministrativeData: boolean;
  canModifyScientificParameters: boolean;
  canPublishLocalAdvisory: boolean;
  canPublishDistrictCommand: boolean;
  canApproveScientificAdvice: boolean;
}

export interface RoleScope {
  role: GovernanceRole;
  titleEn: string;
  titleHi: string;
  scopeBadgeEn: string;
  scopeBadgeHi: string;
  levelEn: string;
  levelHi: string;
  assignedDistrict: string;
  assignedBlock: string;
  assignedPanchayat: string;
  assignedVillages: string[];
  subordinatePanchayatsCount: number;
}

interface RoleContextType {
  role: GovernanceRole;
  setRole: (role: GovernanceRole) => void;
  scope: RoleScope;
  permissions: RolePermissions;
  activePanchayat: PanchayatRecord;
  setActivePanchayatCode: (code: string) => void;
  allDistrictPanchayats: PanchayatRecord[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<GovernanceRole>(() => {
    try {
      const saved = localStorage.getItem('kisaan_governance_role') as GovernanceRole;
      if (saved === 'panchayat_officer' || saved === 'agriculture_expert' || saved === 'district_officer') {
        return saved;
      }
      return 'panchayat_officer';
    } catch {
      return 'panchayat_officer';
    }
  });

  const [activePanchayatCode, setActivePanchayatCode] = useState<string>('0924001001');

  const setRole = (newRole: GovernanceRole) => {
    try {
      localStorage.setItem('kisaan_governance_role', newRole);
    } catch {}
    setRoleState(newRole);
  };

  const activePanchayat =
    DISTRICT_PANCHAYATS.find((p) => p.code === activePanchayatCode) || DISTRICT_PANCHAYATS[0];

  // Derived scope and permissions strictly adhering to user's governance hierarchy
  const scope: RoleScope = React.useMemo(() => {
    switch (role) {
      case 'panchayat_officer':
        return {
          role,
          titleEn: 'Panchayat Officer',
          titleHi: 'पंचायत अधिकारी',
          scopeBadgeEn: `${activePanchayat.name} Panchayat (4 Villages)`,
          scopeBadgeHi: `${activePanchayat.nameHi} पंचायत (4 गांव)`,
          levelEn: 'Local Operations & Village Oversight',
          levelHi: 'स्थानीय ग्राम परिचालन व निगरानी',
          assignedDistrict: 'Lucknow',
          assignedBlock: 'Bakshi Ka Talab',
          assignedPanchayat: activePanchayat.name,
          assignedVillages: activePanchayat.villages.map((v) => v.name),
          subordinatePanchayatsCount: 1
        };

      case 'agriculture_expert':
        return {
          role,
          titleEn: 'Agriculture Expert',
          titleHi: 'कृषि विशेषज्ञ (Agronomist)',
          scopeBadgeEn: 'Central UP Agro-Climatic Plain',
          scopeBadgeHi: 'मध्य उप्र कृषि-जलवायु क्षेत्र',
          levelEn: 'Agronomic Intelligence & Soil Science',
          levelHi: 'कृषि विज्ञान, मृदा व फसल उपयुक्तता',
          assignedDistrict: 'Lucknow Division',
          assignedBlock: 'All Blocks (Scientific Jurisdiction)',
          assignedPanchayat: activePanchayat.name,
          assignedVillages: activePanchayat.villages.map((v) => v.name),
          subordinatePanchayatsCount: DISTRICT_PANCHAYATS.length
        };

      case 'district_officer':
      default:
        return {
          role,
          titleEn: 'District Officer',
          titleHi: 'जिला कृषि व आपदा अधिकारी',
          scopeBadgeEn: 'Lucknow District (8 Blocks, 45 Panchayats)',
          scopeBadgeHi: 'लखनऊ जिला (8 ब्लॉक, 45 पंचायतें)',
          levelEn: 'District Strategic Command & Resource Planning',
          levelHi: 'जिला रणनीतिक कमान व संसाधन आवंटन',
          assignedDistrict: 'Lucknow',
          assignedBlock: 'All 8 Blocks',
          assignedPanchayat: 'District-Wide Command',
          assignedVillages: DISTRICT_PANCHAYATS.flatMap((p) => p.villages.map((v) => v.name)),
          subordinatePanchayatsCount: DISTRICT_PANCHAYATS.length
        };
    }
  }, [role, activePanchayat]);

  const permissions: RolePermissions = React.useMemo(() => {
    switch (role) {
      case 'panchayat_officer':
        return {
          canViewEntireDistrict: false,
          canEditAdministrativeData: true,
          canModifyScientificParameters: false,
          canPublishLocalAdvisory: true,
          canPublishDistrictCommand: false,
          canApproveScientificAdvice: false
        };

      case 'agriculture_expert':
        return {
          canViewEntireDistrict: true,
          canEditAdministrativeData: false,
          canModifyScientificParameters: true,
          canPublishLocalAdvisory: false,
          canPublishDistrictCommand: false,
          canApproveScientificAdvice: true
        };

      case 'district_officer':
      default:
        return {
          canViewEntireDistrict: true,
          canEditAdministrativeData: true,
          canModifyScientificParameters: false,
          canPublishLocalAdvisory: true,
          canPublishDistrictCommand: true,
          canApproveScientificAdvice: false
        };
    }
  }, [role]);

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        scope,
        permissions,
        activePanchayat,
        setActivePanchayatCode,
        allDistrictPanchayats: DISTRICT_PANCHAYATS
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
