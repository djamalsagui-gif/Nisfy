import {
  NisfyContract,
  INITIAL_NISFY_CONTRACTS,
  STANDARD_CONTRACT_ARTICLES,
  NISFY_PROVIDER_PARTY,
  ContractArticle,
  ContractStatus,
} from '../data/contractsData';
import { Advertisement } from '../data/advertisements';
import { ShopVendor } from '../data/youthShopData';
import { buildSyncedContractFromAdForm } from './dynamicContractGenerator';

const CONTRACTS_STORAGE_KEY = 'nisfy_managed_contracts_v1';

export const getManagedContracts = (): NisfyContract[] => {
  try {
    const data = localStorage.getItem(CONTRACTS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(CONTRACTS_STORAGE_KEY, JSON.stringify(INITIAL_NISFY_CONTRACTS));
      return INITIAL_NISFY_CONTRACTS;
    }
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading contracts from storage', err);
    return INITIAL_NISFY_CONTRACTS;
  }
};

export const saveManagedContracts = (contracts: NisfyContract[]): void => {
  try {
    localStorage.setItem(CONTRACTS_STORAGE_KEY, JSON.stringify(contracts));
    window.dispatchEvent(new Event('nisfy_contracts_updated'));
  } catch (err) {
    console.error('Error saving contracts to storage', err);
  }
};

export const getContractById = (contractId: string): NisfyContract | undefined => {
  const contracts = getManagedContracts();
  return contracts.find((c) => c.id === contractId);
};

export const getContractForEntity = (entityId: string): NisfyContract | undefined => {
  const contracts = getManagedContracts();
  return contracts.find((c) => c.targetEntityId === entityId);
};

export const addOrUpdateContract = (contract: NisfyContract): void => {
  const contracts = getManagedContracts();
  const index = contracts.findIndex((c) => c.id === contract.id);
  
  // Re-check if all articles are verified
  const allVerified = contract.articles.every((a) => a.isVerified);
  const updatedContract: NisfyContract = {
    ...contract,
    allArticlesVerified: allVerified,
    updatedAt: new Date().toISOString(),
  };

  let newContracts: NisfyContract[];
  if (index >= 0) {
    newContracts = [...contracts];
    newContracts[index] = updatedContract;
  } else {
    newContracts = [updatedContract, ...contracts];
  }
  saveManagedContracts(newContracts);
};

export const deleteContract = (contractId: string): void => {
  const contracts = getManagedContracts();
  const updated = contracts.filter((c) => c.id !== contractId);
  saveManagedContracts(updated);
};

export const setArticleVerification = (
  contractId: string,
  articleId: string,
  verified: boolean
): NisfyContract | undefined => {
  const contracts = getManagedContracts();
  const contract = contracts.find((c) => c.id === contractId);
  if (!contract) return undefined;

  const updatedArticles = contract.articles.map((art) =>
    art.id === articleId ? { ...art, isVerified: verified } : art
  );

  const allVerified = updatedArticles.every((a) => a.isVerified);
  const nextStatus: ContractStatus = allVerified && contract.status === 'under_review' ? 'verified_ready' : contract.status;

  const updatedContract: NisfyContract = {
    ...contract,
    articles: updatedArticles,
    allArticlesVerified: allVerified,
    status: nextStatus,
    verifiedAt: allVerified ? new Date().toISOString() : contract.verifiedAt,
    updatedAt: new Date().toISOString(),
  };

  addOrUpdateContract(updatedContract);
  return updatedContract;
};

export const verifyAllArticlesInContract = (
  contractId: string,
  adminName: string = 'Super Administrateur'
): NisfyContract | undefined => {
  const contracts = getManagedContracts();
  const contract = contracts.find((c) => c.id === contractId);
  if (!contract) return undefined;

  const updatedArticles = contract.articles.map((art) => ({ ...art, isVerified: true }));

  const updatedContract: NisfyContract = {
    ...contract,
    articles: updatedArticles,
    allArticlesVerified: true,
    verifiedAt: new Date().toISOString(),
    verifiedByAdminName: adminName,
    status: contract.status === 'draft' || contract.status === 'under_review' ? 'verified_ready' : contract.status,
    updatedAt: new Date().toISOString(),
  };

  addOrUpdateContract(updatedContract);
  return updatedContract;
};

export const createDraftContractFromAd = (ad: Advertisement): NisfyContract => {
  return buildSyncedContractFromAdForm(ad);
};

export const syncAndSaveContractForAd = (ad: Advertisement): NisfyContract => {
  const existing = getContractForEntity(ad.id);
  const synced = buildSyncedContractFromAdForm(ad, existing);
  addOrUpdateContract(synced);
  return synced;
};

export const createDraftContractFromVendor = (vendor: ShopVendor): NisfyContract => {
  const now = new Date();
  const nextQuarter = new Date(now);
  nextQuarter.setMonth(nextQuarter.getMonth() + 3);

  const contractNumber = `CTR-${now.getFullYear()}-ESHOP-${vendor.id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()}`;

  return {
    id: `ctr-vendor-${vendor.id}-${Date.now()}`,
    contractNumber,
    contractType: 'ecommerce_vendor',
    contractTypeLabel: 'Contrat Vendeur Boutique E-Commerce',
    contractTypeLabelAr: 'عقد استضافة متجر إلكتروني وبوكسات هدايا',
    title: `Convention d'Hébergement E-Commerce & E-Shop • ${vendor.name}`,
    targetEntityId: vendor.id,
    targetEntityType: 'vendor',
    targetEntityName: vendor.name,
    dateIssued: now.toISOString().split('T')[0],
    startDate: now.toISOString().split('T')[0],
    endDate: vendor.paymentDueDate || nextQuarter.toISOString().split('T')[0],
    durationMonths: vendor.subscriptionPlan === 'starter_shop' ? 1 : vendor.subscriptionPlan === 'pro_shop' ? 3 : 6,
    durationLabel: vendor.subscriptionPlanLabel || '3 Mois (Pack Pro E-Shop)',
    provider: NISFY_PROVIDER_PARTY,
    client: {
      role: 'client',
      entityName: vendor.name,
      entityNameAr: vendor.nameAr,
      representativeName: vendor.contactPerson || 'Artisan / Responsable Boutique',
      legalStatus: 'Artisan / Entreprise E-Commerce',
      address: `Wilaya de ${vendor.wilaya}`,
      wilaya: vendor.wilaya,
      phone: vendor.phone,
      email: vendor.email || 'contact@eshop.dz',
    },
    subjectFr: `Mise à disposition d'une boutique en ligne sur l'E-Shop NISFY, affichage du catalogue de produits (${vendor.categoryLabel}), gestion des commandes directes WhatsApp et badge Vendeur Certifié 🇩🇿.`,
    subjectAr: `استضافة المتجر الإلكتروني وعرض منتجات ${vendor.nameAr || vendor.name} في منصة نصف دينك مع ربط الطلبات المباشرة بالواتساب وتوصيل 58 ولاية.`,
    payment: {
      totalAmount: vendor.monthlyFee ? `${parseInt(vendor.monthlyFee.replace(/[^0-9]/g, '') || '25000') * 3} DZD` : '75 000 DZD',
      monthlyAmount: vendor.monthlyFee || '25 000 DZD / mois',
      currency: 'DZD',
      paymentMethods: ['baridimob', 'virement_cib', 'ccp'],
      schedule: 'mensuel',
      gracePeriodDays: 5,
      bankDetails: 'BaridiMob: 00799999001999990045 (NISFY SARL)',
    },
    termination: {
      noticePeriodDays: 10,
      immediateTerminationReasons: [
        'Impayé d\'abonnement au-delà du délai de grâce de 5 jours',
        'Contrefaçon, malfaçon ou produits non conformes',
        'Refus répété d\'honorer les commandes passées par les clients',
      ],
      refundPolicy: 'Frais d\'hébergement non remboursables pour la période engagée.',
    },
    articles: STANDARD_CONTRACT_ARTICLES.map((a) => ({ ...a, isVerified: false })),
    allArticlesVerified: false,
    status: 'under_review',
    providerSigned: true,
    providerSignDate: now.toISOString().split('T')[0],
    clientSigned: false,
    officialSealApplied: true,
    internalAdminNotes: 'Contrat généré depuis la boutique e-commerce. Passez en revue les articles contractuels.',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
};
