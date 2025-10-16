export default function ServerStatusCards() {
  const servers = [
    {
      name: 'Server 01',
      metrics: [
        { name: 'CPU Usage', value: 80, color: 'bg-red-500' },
        { name: 'Memory Usage', value: 30, color: 'bg-green-500' },
        { name: 'Disk Usage', value: 60, color: 'bg-orange-500' },
      ],
    },
    {
      name: 'Server 02',
      metrics: [
        { name: 'CPU Usage', value: 40, color: 'bg-green-500' },
        { name: 'Memory Usage', value: 95, color: 'bg-red-500' },
        { name: 'Disk Usage', value: 80, color: 'bg-red-500' },
      ],
    },
    {
      name: 'Server 03',
      metrics: [
        { name: 'CPU Usage', value: 40, color: 'bg-green-500' },
        { name: 'Memory Usage', value: 20, color: 'bg-green-500' },
        { name: 'Disk Usage', value: 30, color: 'bg-green-500' },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {servers.map((server) => (
        <div key={server.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-blue-600 mb-4">{server.name}</h3>
          <div className="space-y-4">
            {server.metrics.map((metric) => (
              <div key={metric.name} className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">{metric.name}</span>
                  <span
                    className={`text-sm font-medium ${metric.value > 70 ? 'text-red-600' : metric.value > 50 ? 'text-orange-600' : 'text-green-600'}`}
                  >
                    {metric.value}%
                  </span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${metric.color} rounded-full`} style={{ width: `${metric.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
