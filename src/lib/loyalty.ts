export const loyaltyTiers = {
  bronze: { name: 'Bronze', points: 0, next: 500, color: 'text-yellow-600' },
  silver: { name: 'Silber', points: 500, next: 1500, color: 'text-slate-500' },
  gold: { name: 'Gold', points: 1500, next: Infinity, color: 'text-amber-500' }
};

export const getLoyaltyTier = (points: number) => {
  if (points >= loyaltyTiers.gold.points) return loyaltyTiers.gold;
  if (points >= loyaltyTiers.silver.points) return loyaltyTiers.silver;
  return loyaltyTiers.bronze;
};
