const steps = [
  {
    from: -Infinity,
    duration: -1 * 365 * 24 * 60 * 1000 * 60,
    format: (v) => `${v} year${v > 1 ? "s" : ""} from now`,
  },
  {
    from: -1 * 365 * 24 * 60 * 1000 * 60,
    duration: -1 * 30 * 24 * 60 * 1000 * 60,
    format: (v) => `${v} month${v > 1 ? "s" : ""} from now`,
  },
  {
    from: -1 * 30 * 24 * 60 * 1000 * 60,
    duration: -1 * 7 * 24 * 60 * 1000 * 60,
    format: (v) => `${v} week${v > 1 ? "s" : ""} from now`,
  },
  {
    from: -1 * 7 * 24 * 60 * 1000 * 60,
    duration: -1 * 24 * 60 * 1000 * 60,
    format: (v) => `${v} day${v > 1 ? "s" : ""} from now`,
  },
  { from: 24 * 60 * 1000 * 60 * -1, format: (v) => "today" },
  { from: 24 * 60 * 1000 * 60, format: (v) => "yesterday" },
  {
    from: 48 * 60 * 1000 * 60,
    duration: 24 * 60 * 1000 * 60,
    format: (v) => `${v} day${v > 1 ? "s" : ""} ago`,
  },
  {
    from: 7 * 24 * 60 * 1000 * 60,
    format: (v) => `${v} week${v > 1 ? "s" : ""} ago`,
  },
  {
    from: 30 * 24 * 60 * 1000 * 60,
    format: (v) => `${v} month${v > 1 ? "s" : ""} ago`,
  },
  {
    from: 365 * 24 * 60 * 1000 * 60,
    format: (v) => `${v} year${v > 1 ? "s" : ""} ago`,
  },
];

export function TimeAgo({ value, className = "" }: { value: Date | string; className?: string }) {
  return <time className={className}>{timeAgo(value)}</time>;
}

export default function timeAgo(nd: string | Date) {
  let delta = Date.now() - new Date(nd).getTime();

  for (let i = steps.length - 1; i >= 0; i--) {
    const step = steps[i];
    if (delta >= step.from) return step.format((delta / (step.duration || step.from)) | 0);
  }
}
