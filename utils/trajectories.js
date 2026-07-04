export const getHeatColor = (heat) => {
  const colors = {
    hot: '#FF4500',      // Orange-Red
    warm: '#FFD700',     // Gold
    cold: '#1E90FF',     // Dodger Blue
    frozen: '#808080',   // Gray
  };
  
  return colors[heat.toLowerCase()] || '#FFFFFF'; // Fallback to white
};
