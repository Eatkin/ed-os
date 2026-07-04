export const BASE_LEVEL_XP = 500; // XP needed for level 1
export const XP_STEP = 100; // extra XP required per level thereafter

// Total XP needed to go from level n to level n+1
export function xpForLevel(level) {
  return BASE_LEVEL_XP + (level - 1) * XP_STEP;
}

// Total cumulative XP needed to reach a given level from scratch
export function totalXPForLevel(level) {
  let total = 0;
  for (let i = 1; i < level; i++) total += xpForLevel(i);
  return total;
}

// Given total accumulated XP, derive current level + progress toward next
export function getLevelProgress(totalXP) {
  let level = 1;
  let remaining = totalXP;

  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }

  const currentLevelXP = xpForLevel(level);
  return {
    level,
    currentXP: remaining,
    xpToNextLevel: currentLevelXP,
    xpProgress: Math.round((remaining / currentLevelXP) * 100), // for your bar %
  };
}
