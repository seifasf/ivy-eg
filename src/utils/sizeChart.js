// From the IVY S26 brief ("Find your fit"); measurements are body waist
export const SIZE_CHART = [
  { size: 'S', label: 'Small', cm: 84, inch: 33.1 },
  { size: 'M', label: 'Medium', cm: 92, inch: 36.2 },
  { size: 'L', label: 'Large', cm: 100, inch: 39.4 }
]

export const TOLERANCE_CM = 1
const OUT_OF_RANGE_CM = 4
const CM_PER_INCH = 2.54

// Nearest size by waist; halfway between two sizes goes up for comfort
export const recommendSize = (waist, unit = 'cm') => {
  const cm = unit === 'inch' ? waist * CM_PER_INCH : waist
  if (!Number.isFinite(cm) || cm <= 0) return null

  let best = SIZE_CHART[0]
  for (const row of SIZE_CHART) {
    if (Math.abs(cm - row.cm) <= Math.abs(cm - best.cm)) best = row
  }
  const smallest = SIZE_CHART[0]
  const largest = SIZE_CHART[SIZE_CHART.length - 1]
  let note = ''
  if (cm > largest.cm + OUT_OF_RANGE_CM) note = `Your waist is above our Large (${largest.cm} cm), so it may feel tight.`
  else if (cm > largest.cm + TOLERANCE_CM) note = `You're just above our Large (${largest.cm} cm), so it may feel snug.`
  else if (cm < smallest.cm - OUT_OF_RANGE_CM) note = `Your waist is below our Small (${smallest.cm} cm), so it may feel loose.`
  else if (cm < smallest.cm - TOLERANCE_CM) note = `You're just under our Small (${smallest.cm} cm), so it may feel a little loose.`
  else if (Math.abs(cm - best.cm) > TOLERANCE_CM) note = 'You\'re between sizes; we picked the closer one, sizing up when it\'s a tie.'
  return { ...best, note }
}
