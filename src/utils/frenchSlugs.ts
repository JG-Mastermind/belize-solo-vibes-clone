// French slug to English slug conversion utility
export const convertFrenchSlugToEnglish = (frenchSlug: string): string => {
  const slugMap: Record<string, string> = {
    'aventure-pine-ridge-big-rock-falls-caracol': 'pine-ridge-adventure-big-rock-falls-and-caracol',
    'observation-lamantins-et-journee-plage': 'manatee-watching-and-beach-day',
    'peche-lever-soleil-et-saut-iles': 'sunrise-fishing-and-island-hopping',
    'safari-jungle-nocturne': 'night-jungle-safari',
    'plongee-hol-chan-reserve-marine': 'snorkeling-at-hol-chan-marine-reserve',
    'tyrolienne-jungle-et-tour-cascade': 'jungle-zip-lining-and-waterfall-tour',
    'experience-plongee-blue-hole': 'blue-hole-diving-experience',
    'tour-village-culturel-et-fabrication-chocolat': 'cultural-village-tour-and-chocolate-making',
    'aventure-ruines-mayas-caracol': 'caracol-maya-ruins-adventure',
    'tube-cave-et-trek-jungle': 'cave-tubing-and-jungle-trek'
  };
  
  return slugMap[frenchSlug] || frenchSlug;
};

// English slug to French slug conversion utility
export const convertEnglishSlugToFrench = (englishSlug: string): string => {
  const slugMap: Record<string, string> = {
    'pine-ridge-adventure-big-rock-falls-and-caracol': 'aventure-pine-ridge-big-rock-falls-caracol',
    'manatee-watching-and-beach-day': 'observation-lamantins-et-journee-plage',
    'sunrise-fishing-and-island-hopping': 'peche-lever-soleil-et-saut-iles',
    'night-jungle-safari': 'safari-jungle-nocturne',
    'snorkeling-at-hol-chan-marine-reserve': 'plongee-hol-chan-reserve-marine',
    'jungle-zip-lining-and-waterfall-tour': 'tyrolienne-jungle-et-tour-cascade',
    'blue-hole-diving-experience': 'experience-plongee-blue-hole',
    'cultural-village-tour-and-chocolate-making': 'tour-village-culturel-et-fabrication-chocolat',
    'caracol-maya-ruins-adventure': 'aventure-ruines-mayas-caracol',
    'cave-tubing-and-jungle-trek': 'tube-cave-et-trek-jungle'
  };
  
  return slugMap[englishSlug] || englishSlug;
};