export function shouldCountAsHalf(createdAt: Date, updatedAt: Date): boolean {
  const createdHour = createdAt.getHours();
  const updatedHour = updatedAt.getHours();

  // Check if createdAt is after 8 AM and updatedAt is before 5 PM
  return createdHour > 9 && updatedHour < 17;
}
