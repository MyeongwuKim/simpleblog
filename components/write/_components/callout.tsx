"use client";

import React from "react";
import {
  AiFillBulb,
  AiFillInfoCircle,
  AiFillWarning,
  AiFillAlert,
} from "react-icons/ai";
import { MdError } from "react-icons/md";
import type { IconType } from "react-icons";

export type CalloutType = "tip" | "note" | "warning" | "important" | "caution";

const CALLOUT_CONFIG: Record<
  CalloutType,
  {
    label: string;
    barClassName: string;
    iconClassName: string;
    icon: IconType;
  }
> = {
  tip: {
    label: "TIP",
    barClassName: "before:bg-emerald-500 dark:before:bg-emerald-400",
    iconClassName: "text-emerald-600 dark:text-emerald-400",
    icon: AiFillBulb,
  },
  note: {
    label: "NOTE",
    barClassName: "before:bg-sky-500 dark:before:bg-sky-400",
    iconClassName: "text-sky-600 dark:text-sky-400",
    icon: AiFillInfoCircle,
  },
  warning: {
    label: "WARNING",
    barClassName: "before:bg-amber-500 dark:before:bg-amber-400",
    iconClassName: "text-amber-600 dark:text-amber-400",
    icon: AiFillWarning,
  },
  important: {
    label: "IMPORTANT",
    barClassName: "before:bg-violet-500 dark:before:bg-violet-400",
    iconClassName: "text-violet-600 dark:text-violet-400",
    icon: MdError,
  },
  caution: {
    label: "CAUTION",
    barClassName: "before:bg-rose-500 dark:before:bg-rose-400",
    iconClassName: "text-rose-600 dark:text-rose-400",
    icon: AiFillAlert,
  },
};

interface CalloutProps {
  type: CalloutType;
  children: React.ReactNode;
}

export default function Callout({ type, children }: CalloutProps) {
  const config = CALLOUT_CONFIG[type];
  const Icon = config.icon;

  return (
    <div
      className={`
        relative my-8 overflow-hidden rounded-sm
        bg-background1
        px-8 py-6
        ${config.barClassName} text-text1 
        before:absolute before:left-0 before:top-0 before:h-full before:w-[5px] before:content-['']
      `}
    >
      <div className="mb-4 flex items-center gap-2 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <Icon size={18} className={`shrink-0 ${config.iconClassName}`} />
        <span className="text-xs font-bold tracking-[0.14em] ">
          {config.label}
        </span>
      </div>

      <div className="leading-[1.7] [&>p]:my-0">{children}</div>
    </div>
  );
}
