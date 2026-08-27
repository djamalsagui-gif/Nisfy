import {
  ShopVendor,
  ShopProduct,
  ShopPaymentStatus,
  ShopSubscriptionPlan,
  INITIAL_SHOP_VENDORS,
  INITIAL_SHOP_PRODUCTS
} from '../data/youthShopData';

const SHOP_VENDORS_STORAGE_KEY = 'nisfy_managed_shop_vendors';
const SHOP_PRODUCTS_STORAGE_KEY = 'nisfy_managed_shop_products';

// 1. Get All Managed E-Commerce Vendors
export function getManagedShopVendors(): ShopVendor[] {
  try {
    const data = localStorage.getItem(SHOP_VENDORS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(SHOP_VENDORS_STORAGE_KEY, JSON.stringify(INITIAL_SHOP_VENDORS));
      return INITIAL_SHOP_VENDORS;
    }
    const parsed: ShopVendor[] = JSON.parse(data);
    
    // Ensure initial vendors are present if new
    const storedIds = new Set(parsed.map((v) => v.id));
    const missingDefaults = INITIAL_SHOP_VENDORS.filter((v) => !storedIds.has(v.id));
    if (missingDefaults.length > 0) {
      const merged = [...parsed, ...missingDefaults];
      localStorage.setItem(SHOP_VENDORS_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch (error) {
    console.error('Error reading managed shop vendors from storage:', error);
    return INITIAL_SHOP_VENDORS;
  }
}

// 2. Get All Managed Shop Products
export function getManagedShopProducts(): ShopProduct[] {
  try {
    const data = localStorage.getItem(SHOP_PRODUCTS_STORAGE_KEY);
    if (!data) {
      localStorage.setItem(SHOP_PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_SHOP_PRODUCTS));
      return INITIAL_SHOP_PRODUCTS;
    }
    const parsed: ShopProduct[] = JSON.parse(data);

    const storedIds = new Set(parsed.map((p) => p.id));
    const missingDefaults = INITIAL_SHOP_PRODUCTS.filter((p) => !storedIds.has(p.id));
    if (missingDefaults.length > 0) {
      const merged = [...parsed, ...missingDefaults];
      localStorage.setItem(SHOP_PRODUCTS_STORAGE_KEY, JSON.stringify(merged));
      return merged;
    }
    return parsed;
  } catch (error) {
    console.error('Error reading managed shop products from storage:', error);
    return INITIAL_SHOP_PRODUCTS;
  }
}

// 3. Get ONLY Active Products for the Public Youth Shop
// Products are active if the product is active AND the seller's shop is active!
export function getActiveShopProducts(): ShopProduct[] {
  const allProducts = getManagedShopProducts();
  const allVendors = getManagedShopVendors();
  const activeVendorNames = new Set(
    allVendors.filter((v) => v.isActive).map((v) => v.name.toLowerCase().trim())
  );

  return allProducts.filter((product) => {
    if (product.isActive === false) return false;
    const sellerKey = (product.sellerName || '').toLowerCase().trim();
    // If seller is in vendors list, check if active; otherwise allow
    const vendorRecord = allVendors.find((v) => v.name.toLowerCase().trim() === sellerKey);
    if (vendorRecord && !vendorRecord.isActive) {
      return false;
    }
    return true;
  });
}

// 4. Save Managed Vendors & Dispatch Event
export function saveManagedShopVendors(vendors: ShopVendor[]): void {
  try {
    localStorage.setItem(SHOP_VENDORS_STORAGE_KEY, JSON.stringify(vendors));
    window.dispatchEvent(new Event('nisfy_shop_updated'));
  } catch (error) {
    console.error('Error saving shop vendors:', error);
  }
}

// 5. Save Managed Products & Dispatch Event
export function saveManagedShopProducts(products: ShopProduct[]): void {
  try {
    localStorage.setItem(SHOP_PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    window.dispatchEvent(new Event('nisfy_shop_updated'));
  } catch (error) {
    console.error('Error saving shop products:', error);
  }
}

// 6. Toggle Shop Vendor Active Status (Désactiver en cas de non-paiement)
export function toggleShopVendorActive(vendorId: string): boolean {
  const vendors = getManagedShopVendors();
  let nextState = false;
  const today = new Date().toLocaleDateString('fr-FR');

  const updated = vendors.map((v) => {
    if (v.id === vendorId) {
      nextState = !v.isActive;
      return {
        ...v,
        isActive: nextState,
        internalNotes: nextState
          ? (v.internalNotes || '') + `\n[${today}] Boutique réactivée par l'admin.`
          : (v.internalNotes || '') + `\n[${today}] Boutique suspendue pour non-paiement/retard.`,
      };
    }
    return v;
  });

  saveManagedShopVendors(updated);
  return nextState;
}

// 7. Update Vendor Payment Status & Due Date
export function updateShopVendorPayment(
  vendorId: string,
  paymentStatus: ShopPaymentStatus,
  newDueDate?: string,
  reactivateIfPaid = true
): void {
  const vendors = getManagedShopVendors();
  const today = new Date().toISOString().split('T')[0];

  const updated = vendors.map((v) => {
    if (v.id === vendorId) {
      const isNowPaid = paymentStatus === 'paid';
      return {
        ...v,
        paymentStatus,
        paymentDueDate: newDueDate || v.paymentDueDate,
        lastPaymentDate: isNowPaid ? today : v.lastPaymentDate,
        isActive: isNowPaid && reactivateIfPaid ? true : v.isActive,
        internalNotes:
          (v.internalNotes || '') +
          `\n[${today}] Statut paiement: ${paymentStatus.toUpperCase()}${newDueDate ? ` (Échéance: ${newDueDate})` : ''}.`,
      };
    }
    return v;
  });

  saveManagedShopVendors(updated);
}

// 8. Extend / Renew Vendor Subscription (+1, +3, +6, +12 mois)
export function extendShopVendorSubscription(
  vendorId: string,
  monthsToAdd: number,
  newPlan?: ShopSubscriptionPlan
): void {
  const vendors = getManagedShopVendors();
  const today = new Date();

  const updated = vendors.map((v) => {
    if (v.id === vendorId) {
      const currentEnd = v.endDate ? new Date(v.endDate) : new Date();
      const baseDate = currentEnd > today ? currentEnd : today;

      const newEnd = new Date(baseDate);
      newEnd.setMonth(newEnd.getMonth() + monthsToAdd);
      const newEndStr = newEnd.toISOString().split('T')[0];

      const nextDue = new Date(baseDate);
      nextDue.setMonth(nextDue.getMonth() + Math.min(1, monthsToAdd));
      const nextDueStr = nextDue.toISOString().split('T')[0];

      return {
        ...v,
        isActive: true,
        paymentStatus: 'paid' as ShopPaymentStatus,
        endDate: newEndStr,
        paymentDueDate: nextDueStr,
        subscriptionPlan: newPlan || v.subscriptionPlan,
        lastPaymentDate: today.toISOString().split('T')[0],
        internalNotes:
          (v.internalNotes || '') +
          `\n[${today.toLocaleDateString('fr-FR')}] Renouvellement de l'abonnement e-shop de +${monthsToAdd} mois jusqu'au ${newEndStr}.`,
      };
    }
    return v;
  });

  saveManagedShopVendors(updated);
}

// 9. Add or Update Vendor
export function addOrUpdateShopVendor(vendor: ShopVendor): void {
  const vendors = getManagedShopVendors();
  const index = vendors.findIndex((v) => v.id === vendor.id);
  if (index >= 0) {
    vendors[index] = vendor;
  } else {
    vendors.unshift(vendor);
  }
  saveManagedShopVendors(vendors);
}

// 10. Delete Vendor
export function deleteShopVendor(vendorId: string): void {
  const vendors = getManagedShopVendors();
  const filtered = vendors.filter((v) => v.id !== vendorId);
  saveManagedShopVendors(filtered);
}

// 11. Toggle Individual Product Active
export function toggleShopProductActive(productId: string): boolean {
  const products = getManagedShopProducts();
  let nextState = false;
  const updated = products.map((p) => {
    if (p.id === productId) {
      nextState = p.isActive === false ? true : false;
      return { ...p, isActive: nextState };
    }
    return p;
  });
  saveManagedShopProducts(updated);
  return nextState;
}

// 12. Add or Update Product
export function addOrUpdateShopProduct(product: ShopProduct): void {
  const products = getManagedShopProducts();
  const index = products.findIndex((p) => p.id === product.id);
  if (index >= 0) {
    products[index] = product;
  } else {
    products.unshift(product);
  }
  saveManagedShopProducts(products);
}

// 13. Delete Product
export function deleteShopProduct(productId: string): void {
  const products = getManagedShopProducts();
  const filtered = products.filter((p) => p.id !== productId);
  saveManagedShopProducts(filtered);
}
