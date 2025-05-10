
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { ArrowRight, Percent, DollarSign } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';

type CalculationInput = {
  materials: number;
  production: number;
  packaging: number;
  delivery: number;
  otherCosts: number;
  profitMargin: number;
  usePercentage: boolean;
};

const Calculator = () => {
  const { isPremium } = useAuth();
  const [inputs, setInputs] = useState<CalculationInput>({
    materials: 0,
    production: 0,
    packaging: 0,
    delivery: 0,
    otherCosts: 0,
    profitMargin: 20,
    usePercentage: true
  });
  
  const [results, setResults] = useState({
    totalCost: 0,
    profitAmount: 0,
    suggestedPrice: 0
  });
  
  const handleInputChange = (field: keyof CalculationInput, value: string) => {
    const numValue = value === '' ? 0 : parseFloat(value);
    setInputs({ ...inputs, [field]: numValue });
  };
  
  const toggleProfitType = () => {
    setInputs({ ...inputs, usePercentage: !inputs.usePercentage });
  };
  
  const calculatePrice = () => {
    const totalCost = 
      inputs.materials + 
      inputs.production + 
      inputs.packaging + 
      inputs.delivery + 
      inputs.otherCosts;
    
    let profitAmount = 0;
    let suggestedPrice = 0;
    
    if (inputs.usePercentage) {
      profitAmount = totalCost * (inputs.profitMargin / 100);
      suggestedPrice = totalCost + profitAmount;
    } else {
      profitAmount = inputs.profitMargin;
      suggestedPrice = totalCost + profitAmount;
    }
    
    setResults({
      totalCost,
      profitAmount,
      suggestedPrice
    });
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };
  
  return (
    <DashboardLayout isPremium={isPremium}>
      <div className="space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-2xl font-bold">HPP Calculator</h1>
          <p className="text-muted-foreground">Calculate production costs and suggested selling prices</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Production Costs</CardTitle>
              <CardDescription>Enter all your costs to calculate the total production cost (HPP)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="materials">Raw Materials</Label>
                <Input
                  id="materials"
                  type="number"
                  placeholder="0"
                  value={inputs.materials || ''}
                  onChange={(e) => handleInputChange('materials', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="production">Production Costs</Label>
                <Input
                  id="production"
                  type="number"
                  placeholder="0"
                  value={inputs.production || ''}
                  onChange={(e) => handleInputChange('production', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="packaging">Packaging Costs</Label>
                <Input
                  id="packaging"
                  type="number"
                  placeholder="0"
                  value={inputs.packaging || ''}
                  onChange={(e) => handleInputChange('packaging', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="delivery">Delivery Costs</Label>
                <Input
                  id="delivery"
                  type="number"
                  placeholder="0"
                  value={inputs.delivery || ''}
                  onChange={(e) => handleInputChange('delivery', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="otherCosts">Other Costs</Label>
                <Input
                  id="otherCosts"
                  type="number"
                  placeholder="0"
                  value={inputs.otherCosts || ''}
                  onChange={(e) => handleInputChange('otherCosts', e.target.value)}
                />
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="profitMargin">Profit Margin</Label>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={toggleProfitType} 
                    className="h-8"
                  >
                    {inputs.usePercentage ? <Percent className="h-3.5 w-3.5" /> : <DollarSign className="h-3.5 w-3.5" />}
                  </Button>
                </div>
                <Input
                  id="profitMargin"
                  type="number"
                  placeholder={inputs.usePercentage ? "20" : "0"}
                  value={inputs.profitMargin || ''}
                  onChange={(e) => handleInputChange('profitMargin', e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  {inputs.usePercentage ? "As percentage of costs" : "As flat amount"}
                </p>
              </div>
              
              <Button 
                onClick={calculatePrice} 
                className="w-full bg-amber-500 hover:bg-amber-600"
              >
                Calculate Price <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Calculation Results</CardTitle>
              <CardDescription>Your calculated costs and suggested selling price</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-muted p-4 space-y-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Production Cost (HPP)</p>
                  <h3 className="text-2xl font-bold">{formatCurrency(results.totalCost)}</h3>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profit Amount</p>
                  <h3 className="text-2xl font-bold text-green-600">{formatCurrency(results.profitAmount)}</h3>
                  {inputs.usePercentage && results.totalCost > 0 && (
                    <p className="text-sm text-muted-foreground">
                      {Math.round((results.profitAmount / results.totalCost) * 100)}% of production cost
                    </p>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Suggested Selling Price</p>
                  <h2 className="text-3xl font-bold text-amber-600">{formatCurrency(results.suggestedPrice)}</h2>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Cost Breakdown</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Raw Materials</span>
                    <span>{formatCurrency(inputs.materials)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Production</span>
                    <span>{formatCurrency(inputs.production)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Packaging</span>
                    <span>{formatCurrency(inputs.packaging)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Delivery</span>
                    <span>{formatCurrency(inputs.delivery)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Other Costs</span>
                    <span>{formatCurrency(inputs.otherCosts)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md border border-amber-100 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-300">
                  <strong>Tip:</strong> Consider market factors beyond production costs when setting your final prices, such as competitor pricing and perceived value.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Calculator;
