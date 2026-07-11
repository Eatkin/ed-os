import {
  ATTRIBUTE_LEVEL_UP_THRESHOLD,
  ATTRIBUTE_XP_RATE,
  BASE_LEVEL_XP,
  XP_STEP,
} from "../services/ApiService/DB.constants";

export function xpForLevel(level, attribute = false) {
  const levelXp = attribute ? ATTRIBUTE_LEVEL_UP_THRESHOLD : BASE_LEVEL_XP;
  const xpStep = attribute ? XP_STEP * ATTRIBUTE_XP_RATE : XP_STEP;
  return levelXp + (level - 1) * xpStep;
}

export function totalXPForLevel(level, attribute = false) {
  let total = 0;
  for (let i = 1; i < level; i++) total += xpForLevel(i, attribute);
  return total;
}

export function getLevelProgress(totalXP, attribute = false) {
  let level = 1;
  let remaining = totalXP;

  while (remaining >= xpForLevel(level, attribute) && remaining > 0) {
    remaining -= xpForLevel(level, attribute);
    level++;
  }

  const currentLevelXP = xpForLevel(level, attribute);
  return {
    level,
    currentXP: remaining,
    xpToNextLevel: currentLevelXP,
    xpProgress: Math.round((remaining / currentLevelXP) * 100),
  };
}
