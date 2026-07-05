export const getHeatColour = (heat) => {
  const colours = {
    hot: '#FF4500',      // Orange-Red
    warm: '#FFD700',     // Gold
    cold: '#1E90FF',     // Dodger Blue
    frozen: '#808080',   // Gray
  };
  
  return colours[heat.toLowerCase()] || '#FFFFFF'; // Fallback to white
};
