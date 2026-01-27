export type EventStatus = "ожидает" | "идет" | "завершено";

export interface EventType {
  id: number;
  title: string;
  startTime: string;
  status: EventStatus;
}

interface EventStatusProps {
  status: EventStatus;
}

export default function EventStatus({ status }: EventStatusProps) {
  const statusConfig = {
    ожидает: {
      bg: "bg-gradient-to-r from-yellow-500/20 to-orange-500/20",
      border: "border-yellow-500/50",
      text: "text-yellow-400",
      icon: "⏳",
      pulse: true,
    },
    идет: {
      bg: "bg-gradient-to-r from-green-500/20 to-emerald-500/20",
      border: "border-green-500/50",
      text: "text-green-400",
      icon: "🎉",
      pulse: true,
    },
    завершено: {
      bg: "bg-gradient-to-r from-gray-600/20 to-gray-700/20",
      border: "border-gray-600/50",
      text: "text-gray-400",
      icon: "✓",
      pulse: false,
    },
  };

  const config = statusConfig[status];

  return (
    <div
      className={`
        inline-flex items-center gap-2 px-4 py-2 rounded-full 
        border-2 ${config.bg} ${config.border} ${config.text}
        font-semibold text-sm backdrop-blur-sm
        ${config.pulse ? "animate-pulse" : ""}
        transition-all duration-300
      `}
    >
      <span className="text-lg">{config.icon}</span>
      <span>{status}</span>
    </div>
  );
}
