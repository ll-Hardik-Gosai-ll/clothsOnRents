export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const isDateInRange = (checkDate: string, fromDate: string, toDate: string): boolean => {
  const check = new Date(checkDate);
  const from = new Date(fromDate);
  const to = new Date(toDate);
  
  return check >= from && check <= to;
};

export const hasBookingConflict = (
  newFromDate: string,
  newToDate: string,
  existingBookings: Array<{ fromDate: string; toDate: string; status: string }>
): boolean => {
  return existingBookings.some(booking => {
    if (booking.status === 'cancelled') return false;
    
    const newFrom = new Date(newFromDate);
    const newTo = new Date(newToDate);
    const existingFrom = new Date(booking.fromDate);
    const existingTo = new Date(booking.toDate);
    
    return (
      (newFrom <= existingTo && newTo >= existingFrom)
    );
  });
};

export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};