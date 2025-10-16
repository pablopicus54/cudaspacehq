'use client';

import Link from 'next/link';

const WalletPageComponent = () => {
  return (
    <div className="min-h-screen py-6 px-3">
      <h1 className="text-2xl font-semibold text-text-primary mb-6">Wallet</h1>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500">Current Balance</p>
            <p className="text-3xl font-semibold text-text-primary">$0.00</p>
          </div>
          <Link
            href="#"
            className="px-4 py-2 rounded-md bg-blue-primary text-white hover:bg-blue-600"
          >
            Add Funds
          </Link>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-medium text-blue-700 mb-3">Recent Transactions</h2>
          <p className="text-gray-500">No transactions yet.</p>
        </div>
      </div>
    </div>
  );
};

export default WalletPageComponent;