import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

// Mock data for different time periods
const dailyData = [
  { time: '08:00', focused: 92, warning: 5, needsFocus: 3 },
  { time: '09:00', focused: 88, warning: 8, needsFocus: 4 },
  { time: '10:00', focused: 85, warning: 10, needsFocus: 5 },
  { time: '11:00', focused: 82, warning: 12, needsFocus: 6 },
  { time: '12:00', focused: 78, warning: 14, needsFocus: 8 },
  { time: '13:00', focused: 84, warning: 10, needsFocus: 6 },
  { time: '14:00', focused: 89, warning: 7, needsFocus: 4 },
  { time: '15:00', focused: 91, warning: 6, needsFocus: 3 },
];

const weeklyData = [
  { day: 'Mon', focused: 87, warning: 8, needsFocus: 5 },
  { day: 'Tue', focused: 89, warning: 7, needsFocus: 4 },
  { day: 'Wed', focused: 85, warning: 10, needsFocus: 5 },
  { day: 'Thu', focused: 88, warning: 8, needsFocus: 4 },
  { day: 'Fri', focused: 91, warning: 6, needsFocus: 3 },
  { day: 'Sat', focused: 95, warning: 3, needsFocus: 2 },
  { day: 'Sun', focused: 94, warning: 4, needsFocus: 2 },
];

const monthlyData = [
  { week: 'Week 1', focused: 82, warning: 12, needsFocus: 6 },
  { week: 'Week 2', focused: 85, warning: 10, needsFocus: 5 },
  { week: 'Week 3', focused: 88, warning: 8, needsFocus: 4 },
  { week: 'Week 4', focused: 89, warning: 7, needsFocus: 4 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border rounded-lg p-3 shadow-lg">
        <p className="font-medium text-sm mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="capitalize">{entry.dataKey}:</span>
            <span className="font-medium">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const ComplianceTrendCharts = () => {
  const [period, setPeriod] = useState('daily');
  
  // Calculate trend
  const getTrendData = () => {
    const data = period === 'daily' ? dailyData : period === 'weekly' ? weeklyData : monthlyData;
    const first = data[0].focused;
    const last = data[data.length - 1].focused;
    const diff = last - first;
    return {
      direction: diff > 0 ? 'up' : diff < 0 ? 'down' : 'neutral',
      value: Math.abs(diff),
      current: last,
    };
  };
  
  const trend = getTrendData();
  const TrendIcon = trend.direction === 'up' ? TrendingUp : trend.direction === 'down' ? TrendingDown : Minus;

  const getData = () => {
    switch (period) {
      case 'daily': return dailyData;
      case 'weekly': return weeklyData;
      case 'monthly': return monthlyData;
      default: return dailyData;
    }
  };

  const getXKey = () => {
    switch (period) {
      case 'daily': return 'time';
      case 'weekly': return 'day';
      case 'monthly': return 'week';
      default: return 'time';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Focus Score Trends</CardTitle>
            <Tabs value={period} onValueChange={setPeriod}>
              <TabsList className="h-8">
                <TabsTrigger value="daily" className="text-xs px-3">Today</TabsTrigger>
                <TabsTrigger value="weekly" className="text-xs px-3">Week</TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs px-3">Month</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-3xl font-bold">{trend.current}%</span>
            <div className={`flex items-center gap-1 text-sm ${
              trend.direction === 'up' ? 'text-emerald-500' : 
              trend.direction === 'down' ? 'text-red-500' : 'text-muted-foreground'
            }`}>
              <TrendIcon className="w-4 h-4" />
              <span>{trend.value}%</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {period === 'daily' ? 'since morning' : period === 'weekly' ? 'vs last week' : 'this month'}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[250px] mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={getData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                  <linearGradient id="colorFocused" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorWarning" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorNeedsFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey={getXKey()} 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  className="fill-muted-foreground"
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 100]}
                  className="fill-muted-foreground"
                />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="focused" 
                  stroke="hsl(142, 71%, 45%)" 
                  fill="url(#colorFocused)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="warning" 
                  stroke="hsl(38, 92%, 50%)" 
                  fill="url(#colorWarning)" 
                  strokeWidth={2}
                />
                <Area 
                  type="monotone" 
                  dataKey="needsFocus" 
                  stroke="hsl(0, 84%, 60%)" 
                  fill="url(#colorNeedsFocus)" 
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-xs text-muted-foreground">Focused</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-xs text-muted-foreground">Warning</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-xs text-muted-foreground">Needs Focus</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
