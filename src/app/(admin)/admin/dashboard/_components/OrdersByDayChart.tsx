'use client';

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

interface OrdersByDayChartProps {
    data: { date: string; totalOrders: number }[];
    loading: boolean;
}

export function OrdersByDayChart({ data, loading }: OrdersByDayChartProps) {
  const chartConfig = {
    totalOrders: {
      label: "Bestellungen",
      color: "hsl(var(--primary))",
    },
  };
  
  if (loading) {
    return (
        <Card>
            <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
                 <Skeleton className="h-[250px] w-full" />
            </CardContent>
        </Card>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Bestellungen der letzten 7 Tage</CardTitle>
        <CardDescription>
          Übersicht der eingehenden Bestellungen (Vorbestellungen & Einkaufszettel).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: -20,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)} // z.B. "Mon"
            />
             <YAxis 
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                allowDecimals={false}
             />
            <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
            />
            <Bar dataKey="totalOrders" fill="var(--color-totalOrders)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
