import { useEffect, useState } from "react";

function nowInKolkata() {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

export function LocalClock({ className = "" }: { className?: string }) {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(nowInKolkata());
    const id = window.setInterval(() => setTime(nowInKolkata()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={`type-data ${className}`}>{time ?? "--:--:--"} IST</span>
  );
}
