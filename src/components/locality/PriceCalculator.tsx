"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Calculator, Info, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/badge';

export default function PriceCalculator({ locality }) {
  const [isOpen, setIsOpen] = useState(false);
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
        baseGovt: 0, baseMarket: 0, adjustedGovt: 0, adjustedMarket: 0, totalAdjustment: 0
      });
      return;
    }

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
    }

    let adjustmentFactor = 1;
    if (inputs.parkFacing) adjustmentFactor += (locality.park_factor || 0);
    if (inputs.corner) adjustmentFactor += (locality.corner_factor || 0);
    if (inputs.roadWidth === '6to15') {
      adjustmentFactor += (locality.road_6to15_factor || 0);
    } else if (inputs.roadWidth === '15plus') {
      adjustmentFactor += (locality.road_15plus_factor || 0);
    }

    setResults({
      baseGovt: baseGovt * area,
      baseMarket: baseMarket * area,
      adjustedGovt: baseGovt * adjustmentFactor * area,
      adjustedMarket: baseMarket * adjustmentFactor * area,
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
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mt-4">
      {/* Header / Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-slate-50 transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-blue-100 shadow-lg">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h2 className="text-xl font-bold text-slate-900">Price Calculator</h2>
            {!isOpen && (
              <p className="text-sm text-slate-500 font-medium">
                {inputs.area ? `Calculating for ${inputs.area} sqm...` : "Estimate property values instantly"}
              </p>
            )}
          </div>
        </div>
        {isOpen ? <ChevronUp className="text-slate-400" /> : <ChevronDown className="text-slate-400" />}
      </button>

      {/* Expandable Content */}
      {isOpen && (
        <div className="p-6 pt-0 border-t border-slate-50 bg-white">
          <div className="grid lg:grid-cols-2 gap-8 mt-6">
            
            {/* Input Section */}
            <div className="space-y-5 bg-slate-50/50 p-5 rounded-2xl border border-slate-100">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Configure Details</h3>
              
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">Area (sqm)</label>
                <Input
                  type="number"
                  placeholder="e.g. 150"
                  value={inputs.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  className="h-12 bg-white border-slate-200 focus:ring-blue-500 rounded-xl font-semibold text-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">Property Usage</label>
                <select
                  value={inputs.usageType}
                  onChange={(e) => handleInputChange('usageType', e.target.value)}
                  className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium"
                >
                  <option value="residential_plot">Residential Plot</option>
                  <option value="residential_house">Residential House</option>
                  <option value="commercial_local">Commercial Shop (Local)</option>
                  <option value="commercial_main">Commercial Shop (Main Road)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase">Road Width</label>
                <select
                  value={inputs.roadWidth}
                  onChange={(e) => handleInputChange('roadWidth', e.target.value)}
                  className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 text-slate-700 font-medium"
                >
                  <option value="base">Up to 6m (Base)</option>
                  <option value="6to15">6-15m (+{(locality.road_6to15_factor * 100)}%)</option>
                  <option value="15plus">Above 15m (+{(locality.road_15plus_factor * 100)}%)</option>
                </select>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block text-xs font-bold text-slate-700 uppercase">Premiums</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${inputs.parkFacing ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-slate-200 text-slate-600'}`}>
                    <span className="text-sm font-bold">Park Facing</span>
                    <input
                      type="checkbox"
                      checked={inputs.parkFacing}
                      onChange={(e) => handleInputChange('parkFacing', e.target.checked)}
                      className="w-4 h-4 rounded text-emerald-600"
                    />
                  </label>
                  <label className={`flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${inputs.corner ? 'bg-purple-50 border-purple-200 text-purple-700' : 'bg-white border-slate-200 text-slate-600'}`}>
                    <span className="text-sm font-bold">Corner Plot</span>
                    <input
                      type="checkbox"
                      checked={inputs.corner}
                      onChange={(e) => handleInputChange('corner', e.target.checked)}
                      className="w-4 h-4 rounded text-purple-600"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div className="flex flex-col h-full">
              {inputs.area && parseFloat(inputs.area) > 0 ? (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Estimated Valuation</h3>
                  
                  {/* Summary Row */}
                  <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Base Market Total</p>
                      <p className="text-lg font-bold text-slate-700">₹{results.baseMarket.toLocaleString()}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-slate-300" />
                    <div className="flex-1 text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Premium Applied</p>
                      <Badge className="bg-blue-600 text-white border-none">+{results.totalAdjustment.toFixed(0)}%</Badge>
                    </div>
                  </div>

                  {/* Hero Result Cards */}
                  <div className="grid gap-4">
                    <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl">
                      <p className="text-xs font-bold text-slate-400 uppercase mb-1">Final Govt. Valuation</p>
                      <p className="text-3xl font-black tracking-tight">₹{results.adjustedGovt.toLocaleString()}</p>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 text-white shadow-xl shadow-emerald-100">
                      <p className="text-xs font-bold text-emerald-100 uppercase mb-1">Final Market Valuation</p>
                      <p className="text-3xl font-black tracking-tight">₹{results.adjustedMarket.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-amber-800 leading-relaxed italic">
                      Calculations are based on selected premiums. Final value may vary based on exact field inspection and registry protocols.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-3xl p-10 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                    <Calculator className="w-8 h-8 text-slate-300" />
                  </div>
                  <h4 className="font-bold text-slate-400 uppercase text-sm tracking-widest">Awaiting Inputs</h4>
                  <p className="text-slate-400 text-xs mt-2 max-w-[200px]">Enter the property area above to see the breakdown</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )
      }
    </div>
  );
}