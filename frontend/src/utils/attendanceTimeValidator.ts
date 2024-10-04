export function shouldCountAsHalf(
  createdAt: Date,
  updatedAt: Date,
  startTime: any,
  endTime: any
): boolean {
  const createdHour = createdAt.getHours();
  const updatedHour = updatedAt.getHours();

  const workingSTime = startTime - createdHour >= 0;
  const workingETime = updatedHour - endTime >= 0;

  // Check if createdAt is after 8 AM and updatedAt is before 5 PM
  return workingSTime && workingETime;
}
