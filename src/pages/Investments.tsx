
import { useState } from "react";
import { ArrowLeft, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const investmentData = {
  sp500: [
    { date: "Jan", value: 4500 },
    { date: "Feb", value: 4550 },
    { date: "Mar", value: 4600 },
    { date: "Apr", value: 4700 },
    { date: "May", value: 4760 },
    { date: "Jun", value: 4800 },
    { date: "Jul", value: 4900 },
    { date: "Aug", value: 5050 },
    { date: "Sep", value: 5020 },
    { date: "Oct", value: 5100 },
    { date: "Nov", value: 5250 },
    { date: "Dec", value: 5300 },
  ],
  bitcoin: [
    { date: "Jan", value: 42000 },
    { date: "Feb", value: 44000 },
    { date: "Mar", value: 45000 },
    { date: "Apr", value: 47000 },
    { date: "May", value: 50000 },
    { date: "Jun", value: 48000 },
    { date: "Jul", value: 52000 },
    { date: "Aug", value: 56000 },
    { date: "Sep", value: 60000 },
    { date: "Oct", value: 63000 },
    { date: "Nov", value: 61000 },
    { date: "Dec", value: 68000 },
  ],
  pepe: [
    { date: "Jan", value: 0.00008 },
    { date: "Feb", value: 0.00009 },
    { date: "Mar", value: 0.0001 },
    { date: "Apr", value: 0.00011 },
    { date: "May", value: 0.00014 },
    { date: "Jun", value: 0.00012 },
    { date: "Jul", value: 0.00016 },
    { date: "Aug", value: 0.0002 },
    { date: "Sep", value: 0.00022 },
    { date: "Oct", value: 0.00025 },
    { date: "Nov", value: 0.00028 },
    { date: "Dec", value: 0.0003 },
  ],
};

const formatValue = (value: number, asset: string) => {
  if (asset === "pepe") {
    return `$${value.toFixed(5)}`;
  } else if (asset === "bitcoin") {
    return `$${value.toLocaleString()}`;
  } else {
    return value.toLocaleString();
  }
};

const assetInfo = {
  sp500: {
    name: "S&P 500",
    color: "#0EA5E9",
    description: "A stock market index tracking the performance of 500 large companies listed on stock exchanges in the United States.",
    change: "+17.8%",
  },
  bitcoin: {
    name: "Bitcoin",
    color: "#F97316",
    description: "The first decentralized cryptocurrency, founded in 2009.",
    change: "+61.9%",
  },
  pepe: {
    name: "PEPE",
    color: "#8B5CF6",
    description: "A meme cryptocurrency based on the Pepe the Frog character.",
    change: "+275%",
  },
};

const Investments = () => {
  const navigate = useNavigate();
  const [selectedAsset, setSelectedAsset] = useState<"sp500" | "bitcoin" | "pepe">("sp500");

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            className="h-8 w-8 p-0 text-white" 
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-[#8E9196]" />
            <h2 className="text-4xl font-bold tracking-wider text-[#222222] opacity-80 hover:opacity-100 transition-opacity duration-300" 
                style={{
                  textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                  letterSpacing: '0.2em'
                }}>
              investments
            </h2>
          </div>
        </div>

        <Tabs defaultValue="sp500" onValueChange={(v) => setSelectedAsset(v as any)}>
          <div className="flex justify-center mb-8">
            <TabsList className="bg-background/10">
              <TabsTrigger value="sp500">S&P 500</TabsTrigger>
              <TabsTrigger value="bitcoin">Bitcoin</TabsTrigger>
              <TabsTrigger value="pepe">PEPE</TabsTrigger>
            </TabsList>
          </div>

          {Object.entries(assetInfo).map(([key, asset]) => (
            <TabsContent key={key} value={key}>
              <Card className="glass-card shadow-lg border-none bg-gradient-to-br from-background/20 to-background/5 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-2xl font-bold">{asset.name}</CardTitle>
                      <CardDescription>{asset.description}</CardDescription>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-2xl font-bold">
                        {formatValue(investmentData[key as keyof typeof investmentData][11].value, key)}
                      </span>
                      <span className="text-emerald-400 font-medium">{asset.change} YTD</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-72">
                    <ChartContainer
                      config={{
                        value: {
                          color: asset.color,
                        },
                      }}
                    >
                      <AreaChart
                        data={investmentData[key as keyof typeof investmentData]}
                        margin={{
                          top: 20,
                          right: 5,
                          left: 10,
                          bottom: 5,
                        }}
                      >
                        <defs>
                          <linearGradient id={`${key}Gradient`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={asset.color} stopOpacity={0.3} />
                            <stop offset="95%" stopColor={asset.color} stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis 
                          dataKey="date"
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                        />
                        <YAxis
                          stroke="#888888"
                          fontSize={12}
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(value) => {
                            if (key === "pepe") {
                              return `$${value.toFixed(5)}`;
                            } else if (key === "bitcoin") {
                              return `$${Math.floor(value / 1000)}k`;
                            } else {
                              return value;
                            }
                          }}
                        />
                        <ChartTooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <ChartTooltipContent
                                  payload={payload}
                                  formatter={(value) => [
                                    formatValue(Number(value), key),
                                    "Value",
                                  ]}
                                />
                              );
                            }
                            return null;
                          }}
                        />
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={asset.color}
                          fillOpacity={1}
                          fill={`url(#${key}Gradient)`}
                        />
                      </AreaChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default Investments;
