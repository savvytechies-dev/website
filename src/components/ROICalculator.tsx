import { useState } from 'react';

export default function ROICalculator() {
  const [users, setUsers] = useState(50000);
  const [approach, setApproach] = useState<'diy' | 'auth0' | 'cognito'>('diy');

  // Calculate costs.
  // All figures are annual and grounded in published 2026 list pricing:
  //  - AWS Cognito Essentials: $0.015/MAU, first 10K MAU free (aws.amazon.com/cognito/pricing).
  //  - Auth0 B2C Enterprise: ~$0.066-$0.085/MAU/mo list, typically discounted 50-70%;
  //    we model an effective ~$0.05/MAU/mo at scale (auth0.com/pricing + industry quotes).
  //  - SavvyTechies (managed Keycloak): platform base + low per-MAU, priced ~60% under Auth0.
  const round = (n: number) => Math.round(n / 100) * 100;

  // Managed Keycloak: flat $0.02/MAU/month — the canonical published rate.
  // Grounded in COGS (~$0.0017/MAU/mo infra → ~90% gross margin) and set to land
  // ~60% under Auth0 at scale. Matches the flat pricing block on the site.
  const savvyTechiesAnnual = (mau: number) => round(mau * 0.02 * 12);

  // Auth0 B2C: self-serve up to ~25K MAU, enterprise (effective, post-discount) beyond.
  const auth0Annual = (mau: number) => {
    const monthly =
      mau <= 25000 ? mau * 0.07 : 25000 * 0.07 + (mau - 25000) * 0.05;
    return round(Math.max(monthly, 150) * 12);
  };

  // AWS Cognito Essentials ($0.015/MAU, 10K free) + the ops team you still have to run it.
  const cognitoAnnual = (mau: number) => {
    const cognito = Math.max(0, mau - 10000) * 0.015 * 12;
    const ops = mau > 100000 ? 120000 : mau > 25000 ? 60000 : 24000;
    return round(cognito + ops);
  };

  // DIY self-managed: identity engineers (loaded cost) + multi-region infra + tooling.
  const diyAnnual = (mau: number) => {
    const engineers = mau > 250000 ? 4 : mau > 50000 ? 3 : 2;
    const infra = mau > 250000 ? 90000 : mau > 50000 ? 48000 : 24000;
    return round(engineers * 190000 + infra + 24000);
  };

  const calculateCosts = () => {
    const savvyTechiesCost = savvyTechiesAnnual(users);

    let competitorCost = 0;
    let competitorName = '';

    switch (approach) {
      case 'diy':
        competitorCost = diyAnnual(users);
        competitorName = 'DIY Self-Managed';
        break;
      case 'auth0':
        competitorCost = auth0Annual(users);
        competitorName = 'Auth0';
        break;
      case 'cognito':
        competitorCost = cognitoAnnual(users);
        competitorName = 'AWS Cognito + Operations';
        break;
    }

    const savings = competitorCost - savvyTechiesCost;
    const savingsPercent =
      competitorCost > 0
        ? parseFloat(((savings / competitorCost) * 100).toFixed(1))
        : 0;

    return {
      savvyTechiesCost,
      competitorCost,
      competitorName,
      savings,
      savingsPercent
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
