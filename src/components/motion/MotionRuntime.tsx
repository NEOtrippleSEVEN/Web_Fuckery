"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { prefersReducedMotion } from "@/lib/motion.config";
import { LOADER_KEY, READY_EVENT } from "@/lib/motion.flags";

type Core = typeof import("@/lib/motion-core");

// Thin loader kept in the initial bundle; the heavy motion chunk arrives
// right after hydration. Without JS (or before it lands) the site is fully
// readable — choreography only ever subtracts from a visible page.
export default function MotionRuntime() {
  const router = useRouter();
  const pathname = usePathname();
  const [core, setCore] = useState<Core | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    let alive = true;
    import("@/lib/motion-core").then((mod) => {
      if (!alive) return;
      mod.boot((href) => router.push(href));
      setCore(mod);
    });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!core) return;
    cleanupRef.current = core.route(pathname);
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = null;
    };
  }, [core, pathname]);

  // If the chunk never arrives (offline, blocked), the preloader markup must
  // not trap the page: hard-remove it and release the choreography gate.
  useEffect(() => {
    const failsafe = window.setTimeout(() => {
      if (!core && !prefersReducedMotion() && !sessionStorage.getItem(LOADER_KEY)) {
        document.querySelector("[data-loader-overlay]")?.remove();
        sessionStorage.setItem(LOADER_KEY, "1");
        window.dispatchEvent(new Event(READY_EVENT));
      }
    }, 3000);
    return () => window.clearTimeout(failsafe);
  }, [core]);

  return null;
}
