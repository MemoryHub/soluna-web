'use client';

interface ControlPanelProps {
  characterCount: number;
  timeSpeed: string;
  onTimeSpeedChange: (speed: string) => void;
  onAddCharacter: () => void;
}

export default function ControlPanel({
  characterCount,
  timeSpeed,
  onTimeSpeedChange,
  onAddCharacter
}: ControlPanelProps) {
  const timeSpeeds = [
    { value: 'pause', label: '暂停', icon: 'fa-pause' },
    { value: '1x', label: '1x', icon: '' },
    { value: '2x', label: '2x', icon: '' },
    { value: '10x', label: '10x', icon: '' }
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
      <div className="flex items-center gap-3">
        <button 
          onClick={onAddCharacter}
          className="bg-[#2d3748] hover:bg-gray-700 px-3 py-1 text-xs rounded-sm transition"
        >
          <i className="fa fa-plus mr-1"></i> 添加观察对象
        </button>
        <div className="text-xs text-gray-500">
          已观察 <span className="text-monitor-highlight">{characterCount}</span> 个角色
        </div>
      </div>
      
      <div className="flex items-center gap-3 w-full md:w-auto">
        <div className="text-xs">时间流速:</div>
        {timeSpeeds.map((speed) => (
          <button
            key={speed.value}
            onClick={() => onTimeSpeedChange(speed.value)}
            className={`px-2 py-1 text-xs rounded-sm transition ${
              timeSpeed === speed.value
                ? 'bg-[#38b2ac] text-black'
                : 'bg-[#2d3748] hover:bg-gray-700'
            }`}
          >
            {speed.icon && <i className={`fa ${speed.icon}`}></i>}
            {speed.label}
          </button>
        ))}
      </div>
    </div>
  );
}
