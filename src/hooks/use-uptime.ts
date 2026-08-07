import { useEffect, useState } from "react";
import { careerUptime } from "@/lib/uptime";

export function useUptime() {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    setValue(careerUptime());
    const id = window.setInterval(() => setValue(careerUptime()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return value;
}
