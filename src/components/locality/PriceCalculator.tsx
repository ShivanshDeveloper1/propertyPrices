
import React, { useState, useEffect, useCallback } from 'react';
import { Calculator, Info } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function PriceCalculator({ locality }) {
  const [inputs, setInputs] = useState({
    area: '',
    usageType: 'residential_plot',
    roadWidth: 'base',
    parkFacing: false,
    corner: false
  });

  const [results, setResults] = useState({
    baseGovt: 0,
    baseMarket: 0,
    adjustedGovt: 0,
    adjustedMarket: 0,
    totalAdjustment: 0
  });

  const calculatePrices = useCallback(() => {
    const area = parseFloat(inputs.area) || 0;
    if (area === 0) {
      setResults({
        baseGovt: 0,
        baseMarket: 0,
        adjustedGovt: 0,
        adjustedMarket: 0,
        totalAdjustment: 0
      });
      return;
    }

    // Get base rates
    let baseGovt = 0;
    let baseMarket = 0;

    switch (inputs.usageType) {
      case 'residential_plot':
        baseGovt = locality.residential_plot_govt || 0;
        baseMarket = locality.residential_plot_market || 0;
        break;
      case 'residential_house':
        baseGovt = locality.residential_house_govt || 0;
        baseMarket = locality.residential_house_market || 0;
        break;
      case 'commercial_local':
        baseGovt = locality.commercial_shop_local_govt || 0;
        baseMarket = locality.commercial_shop_local_market || 0;
        break;
      case 'commercial_main':
        baseGovt = locality.commercial_shop_main_govt || 0;
        baseMarket = locality.commercial_shop_main_market || 0;
        break;
      default:
        // do nothing
    }

    // Calculate adjustments
    let adjustmentFactor = 1;
    
    if (inputs.parkFacing) adjustmentFactor += (locality.park_factor || 0);
    if (inputs.corner) adjustmentFactor += (locality.corner_factor || 0);
    
    if (inputs.roadWidth === '6to15') {
      adjustmentFactor += (locality.road_6to15_factor || 0);
    } else if (inputs.roadWidth === '15plus') {
      adjustmentFactor += (locality.road_15plus_factor || 0);
    }

    const adjustedGovt = baseGovt * adjustmentFactor * area;
    const adjustedMarket = baseMarket * adjustmentFactor * area;

    setResults({
      baseGovt: baseGovt * area,
      baseMarket: baseMarket * area,
      adjustedGovt,
      adjustedMarket,
      totalAdjustment: (adjustmentFactor - 1) * 100
    });
  }, [inputs, locality]);

  useEffect(() => {
    calculatePrices();
  }, [calculatePrices]);

  const handleInputChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-600 rounded-xl flex items-center justify-center">
          <Calculator className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Price Calculator</h2>
          <p className="text-gray-600">Calculate estimated property values</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Property Details</h3>
          
          {/* Area Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Area (sqm)
            </label>
            <Input
              type="number"
              placeholder="Enter area in square meters"
              value={inputs.area}
              onChange={(e) => handleInputChange('area', e.target.value)}
              className="h-12"
            />
          </div>

          {/* Usage Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Property Type
            </label>
            <select
              value={inputs.usageType}
              onChange={(e) => handleInputChange('usageType', e.target.value)}
              className="w-full h-12 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            >
              <option value="residential_plot">Residential Plot</option>
              <option value="residential_house">Residential House</option>
              <option value="commercial_local">Commercial Shop (Local)</option>
              <option value="commercial_main">Commercial Shop (Main Road)</option>
            </select>
          </div>

          {/* Road Width */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Road Width
            </label>
            <select
              value={inputs.roadWidth}
              onChange={(e) => handleInputChange('roadWidth', e.target.value)}
              className="w-full h-12 px-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
            >
              <option value="base">Up to 6m (Base rate)</option>
              <option value="6to15">6-15m (+{(locality.road_6to15_factor * 100)}%)</option>
              <option value="15plus">Above 15m (+{(locality.road_15plus_factor * 100)}%)</option>
            </select>
          </div>

          {/* Special Features */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Special Features
            </label>
            
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={inputs.parkFacing}
                onChange={(e) => handleInputChange('parkFacing', e.target.checked)}
                className="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
              />
              <span className="text-gray-700">Park-facing (+{(locality.park_factor * 100)}%)</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={inputs.corner}
                onChange={(e) => handleInputChange('corner', e.target.checked)}
                className="w-4 h-4 text-slate-600 border-gray-300 rounded focus:ring-slate-500"
              />
              <span className="text-gray-700">Corner plot (+{(locality.corner_factor * 100)}%)</span>
            </label>
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Calculated Values</h3>
          
          {inputs.area && parseFloat(inputs.area) > 0 ? (
            <div className="space-y-4">
              {/* Base Values */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-medium text-gray-900 mb-3">Base Values</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Government Rate</span>
                    <span className="font-semibold">₹{results.baseGovt.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Market Rate</span>
                    <span className="font-semibold">₹{results.baseMarket.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Adjustments */}
              {results.totalAdjustment > 0 && (
                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-medium text-gray-900 mb-3">Adjustments</h4>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-blue-100 text-blue-700">
                      +{results.totalAdjustment.toFixed(1)}%
                    </Badge>
                    <span className="text-sm text-gray-600">total premium</span>
                  </div>
                </div>
              )}

              {/* Final Values */}
              <div className="bg-gradient-to-br from-slate-50 to-teal-50 rounded-xl p-4 border border-slate-200">
                <h4 className="font-medium text-gray-900 mb-3">Final Estimated Values</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Government Rate</span>
                    <span className="text-xl font-bold text-slate-700">
                      ₹{results.adjustedGovt.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Market Rate</span>
                    <span className="text-xl font-bold text-teal-700">
                      ₹{results.adjustedMarket.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <strong>Note:</strong> These are estimates based on available data. 
                    Actual values may vary based on specific property conditions, 
                    market dynamics, and official assessments.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-8 text-center">
              <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Enter property area to see calculated values</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
