import { useState } from 'react';

export default function ROICalculator() {
  const [users, setUsers] = useState(50000);
  const [approach, setApproach] = useState<'diy' | 'auth0' | 'cognito'>('diy');

  // Calculate costs
  const calculateCosts = () => {
    const savvyTechiesCost = users <= 10000 ? 24000 : users <= 100000 ? 75000 : 200000;

    let competitorCost = 0;
    let competitorName = '';

    switch (approach) {
      case 'diy':
        // DIY costs: Infrastructure + personnel + monitoring
        competitorCost = 2505000 + 1668000; // Fixed + monitoring (traditional)
        competitorName = 'DIY Self-Managed';
        break;
      case 'auth0':
        // Auth0 B2B: Base + per connection costs
        if (users <= 30000) {
          competitorCost = 35 * 12; // Essentials
        } else if (users <= 100000) {
          competitorCost = 240 * 12; // Professional
        } else {
          competitorCost = 50000; // Enterprise
        }
        // Add SSO connection costs (assume 10 connections)
        competitorCost += users > 10000 ? 40000 : 0;
        competitorName = 'Auth0';
        break;
      case 'cognito':
        // AWS Cognito: Pay per MAU
        const mau = users;
        if (mau <= 50000) {
          competitorCost = 0;
        } else if (mau <= 100000) {
          competitorCost = (mau - 50000) * 0.015 * 12;
        } else {
          competitorCost = 50000 * 0.015 * 12 + (mau - 100000) * 0.012 * 12;
        }
        // Add operational costs for DIY management
        competitorCost += 150000; // 1 engineer
        competitorName = 'AWS Cognito + Operations';
        break;
    }

    const savings = competitorCost - savvyTechiesCost;
    const savingsPercent = ((savings / competitorCost) * 100).toFixed(1);

    return {
      savvyTechiesCost,
      competitorCost,
      competitorName,
      savings,
      savingsPercent: parseFloat(savingsPercent)
    };
  };

  const results = calculateCosts();

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
      <div className="space-y-6">
        {/* Input: Number of Users */}
        <div>
          <label htmlFor="users" className="block text-lg font-semibold text-gray-900 mb-2">
            Monthly Active Users (MAU)
          </label>
          <input
            type="range"
            id="users"
            min="1000"
            max="500000"
            step="1000"
            value={users}
            onChange={(e) => setUsers(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>1K</span>
            <span className="text-xl font-bold text-primary-600">{users.toLocaleString()}</span>
            <span>500K</span>
          </div>
        </div>

        {/* Input: Comparison */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-2">
            Compare Against
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setApproach('diy')}
              className={`p-4 rounded-lg border-2 transition ${
                approach === 'diy'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold">DIY Self-Managed</div>
              <div className="text-sm text-gray-600">In-house solution</div>
            </button>
            <button
              onClick={() => setApproach('auth0')}
              className={`p-4 rounded-lg border-2 transition ${
                approach === 'auth0'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold">Auth0</div>
              <div className="text-sm text-gray-600">Market leader</div>
            </button>
            <button
              onClick={() => setApproach('cognito')}
              className={`p-4 rounded-lg border-2 transition ${
                approach === 'cognito'
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold">AWS Cognito</div>
              <div className="text-sm text-gray-600">Cloud-native</div>
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl p-6 mt-8">
          <h3 className="text-2xl font-bold text-center mb-6">Annual Cost Comparison</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">{results.competitorName}</div>
              <div className="text-3xl font-bold text-gray-900">
                ${results.competitorCost.toLocaleString()}
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">SavvyTechies</div>
              <div className="text-3xl font-bold text-primary-600">
                ${results.savvyTechiesCost.toLocaleString()}
              </div>
            </div>
          </div>

          <div className="text-center border-t-2 border-gray-200 pt-6">
            <div className="text-sm text-gray-600 mb-2">Annual Savings</div>
            <div className="text-4xl font-bold text-green-600 mb-2">
              ${Math.abs(results.savings).toLocaleString()}
            </div>
            <div className="text-xl">
              {results.savings > 0 ? (
                <span className="text-green-600">
                  Save {results.savingsPercent}% per year
                </span>
              ) : (
                <span className="text-orange-600">
                  {Math.abs(results.savingsPercent)}% premium for enterprise features
                </span>
              )}
            </div>
          </div>

          {/* Value Props */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-sm font-semibold text-gray-900 mb-3">What You Get with SavvyTechies:</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>99.99% SLA (vs 99.9%)</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>AI-Powered Automation</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>True Multi-Cloud</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>No Vendor Lock-in</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>&lt;60s Recovery Time</span>
              </div>
              <div className="flex items-center">
                <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
                </svg>
                <span>24/7 Expert Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
