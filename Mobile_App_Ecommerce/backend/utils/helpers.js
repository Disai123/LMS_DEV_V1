/**
 * Generate unique order number
 * Format: ORD-YYYYMMDD-HHMMSS-XXXX
 */
const generateOrderNumber = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  
  return `ORD-${year}${month}${day}-${hours}${minutes}${seconds}-${random}`;
};

/**
 * Format price to 2 decimal places
 */
const formatPrice = (price) => {
  return parseFloat(price).toFixed(2);
};

/**
 * Calculate total price
 */
const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    return total + (parseFloat(item.price) * parseInt(item.quantity));
  }, 0);
};

/**
 * Sanitize input string
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

module.exports = {
  generateOrderNumber,
  formatPrice,
  calculateTotal,
  sanitizeInput
};

