import {
  BASE_LEVEL_XP,
  XP_STEP,
} from "../services/ApiService/DB.constants";

export function xpForLevel(level, baseLevelXP = BASE_LEVEL_XP, xpStep = XP_STEP) {
  return baseLevelXP + (level - 1) * xpStep;
}

export function totalXPForLevel(level, baseLevelXP = BASE_LEVEL_XP, xpStep = XP_STEP) {
  let total = 0;
  for (let i = 1; i < level; i++) total += xpForLevel(i, baseLevelXP, xpStep);
  return total;
}

export function getLevelProgress(totalXP, baseLevelXP = BASE_LEVEL_XP, xpStep = XP_STEP) {
  let level = 1;
  let remaining = totalXP;

  while (remaining >= xpForLevel(level, baseLevelXP, xpStep) && remaining > 0) {
    remaining -= xpForLevel(level, baseLevelXP, xpStep);
    level++;
  }

  const currentLevelXP = xpForLevel(level, baseLevelXP, xpStep);
  return {
    level,
    currentXP: remaining,
    xpToNextLevel: currentLevelXP,
    xpProgress: Math.round((remaining / currentLevelXP) * 100),
  };
}
