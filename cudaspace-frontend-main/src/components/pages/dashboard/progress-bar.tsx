interface ProgressBarProps {
  value: number
  maxValue?: number
  color?: string
  height?: string
  className?: string
}

export default function ProgressBar({
  value,
  maxValue = 100,
  color = 'bg-blue-500',
  height = 'h-2',
  className = '',
}: ProgressBarProps) {
  const percentage = Math.min(Math.max(0, (value / maxValue) * 100), 100);

  // Determine color based on percentage if not explicitly provided
  let barColor = color;
  if (color === 'auto') {
    if (percentage > 70) {
      barColor = 'bg-red-500';
    } else if (percentage > 50) {
      barColor = 'bg-orange-500';
    } else {
      barColor = 'bg-green-500';
    }
  }

  return (
    <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${height} ${className}`}>
      <div
        className={`${barColor} ${height} rounded-full transition-all duration-300 ease-in-out`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
}
