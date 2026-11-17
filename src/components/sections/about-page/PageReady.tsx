"use client";

import { useEffect } from "react";
import { markReady } from "@/lib/ready";

/** Inner pages have no preloader. Release the nav as soon as they mount. */
export function PageReady() {
  useEffect(() => {
    markReady();
  }, []);
  return null;
}
