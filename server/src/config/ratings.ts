// no rating can move more than this value
export const MAX_SHIFT = 10

export const MIN_OVR = 45
export const MAX_OVR = 99

// weight range for run competitiveness
export const RUN_COMP_MIN_WT = 0.5
export const RUN_COMP_MAX_WT = 1.2

// weight range for weighter overall
export const RATER_MIN_WT = 0.5
export const RATER_MAX_WT = 1.2

export const OVERLAP_MS_THRESH = 2 * 60 * 1000

// ranges for overlap weights
export const MIN_OVERLAP_WT = 0.05
export const MAX_OVERLAP_WT = 1

// if lifetime sessions less than 5 no outliers
export const MIN_LIFETIME_CT = 5

// set two different thresholds 
export const OVERLAP_DIFF_THRESH_1 = 30
export const OVERLAP_DIFF_THRESH_2 = 20

export const OVERLAP_DIFF_THRESH_2_WT = 0.5

// magic numbers for computing experience weight
export const MIN_EXPERIENCE_WT = 0.7
export const MAX_EXPERIENCE_WT = 1.05
export const EXPERIENCE_GROWTH_RT = 5

export const EST_RATINGS_PER_SESS = 8


