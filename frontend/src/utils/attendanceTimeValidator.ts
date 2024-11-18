import { ITAttendance } from 'src/types/attendance';

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

export function calWorkHours(createdAt: any, updatedAt: any): number {
  const date1 = new Date(updatedAt);
  const date2 = new Date(createdAt);

  // Calculate the difference in milliseconds
  const differenceInMilliseconds: number = +date1 - +date2; // Use unary plus to convert to number

  // Convert milliseconds to hours
  const differenceInHours = differenceInMilliseconds / (1000 * 60 * 60);

  return differenceInHours;
}

export function calTotalWorkHours(attendances: ITAttendance[]): number {
  let totalHours = 0;

  attendances.forEach((item) => {
    const dayHours = calWorkHours(item.createdAt, item.updatedAt);
    totalHours += dayHours;
  });

  return Number(totalHours.toFixed(2));
}
