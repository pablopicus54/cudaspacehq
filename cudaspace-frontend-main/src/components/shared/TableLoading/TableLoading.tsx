'use client';
import { Skeleton } from 'antd';

const TableLoading = () => {
  return (
    <main className="flex-1 overflow-y-auto p-4 ">
      <h1 className="text-2xl font-bold mb-6">
        <Skeleton.Input active size="default" style={{ width: 200 }} />
      </h1>

      {/* Clients List Skeleton */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-text-primary">
            <Skeleton.Input active size="default" style={{ width: 150 }} />
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                {[...Array(6)].map((_, i) => (
                  <th key={i} className="px-6 py-3 text-left">
                    <Skeleton.Input active size="small" style={{ width: 80 }} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...Array(5)].map((_, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50">
                  {[...Array(6)].map((_, cellIndex) => (
                    <td key={cellIndex} className="px-6 py-4 whitespace-nowrap">
                      <Skeleton.Input 
                        active 
                        size="small" 
                        style={{ 
                          width: cellIndex === 5 ? 100 : 120,
                          height: 24, 
                        }} 
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center my-4">
            <Skeleton active paragraph={{ rows: 0 }} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default TableLoading;