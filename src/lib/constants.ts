export const BUSINESS_HOURS = {
  // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  closedDays: [0], // Sunday closed
  
  // Earliest pickup (e.g., 8:00 AM)
  openHour: 8,
  // Latest pickup (e.g., 6:00 PM)
  closeHour: 18,
  
  // Do you need lead time? (e.g. min. 2 hours before order)
  minPrepTimeHours: 2,
};
