import { profile } from "@/data/content";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/** "UPTIME 1y 7mo 06d 14:32:09" measured from the career start date. */
export function uptimeFrom(startIso: string) {
  const start = new Date(`${startIso}T00:00:00`);
  const now = new Date();

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  let days = now.getDate() - start.getDate();
  let hours = now.getHours() - start.getHours();
  let minutes = now.getMinutes() - start.getMinutes();
  let seconds = now.getSeconds() - start.getSeconds();

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    days += prevMonth;
    months -= 1;
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return `UPTIME ${years}y ${months}mo ${pad(days)}d ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function careerUptime() {
  return uptimeFrom(profile.careerStart);
}
