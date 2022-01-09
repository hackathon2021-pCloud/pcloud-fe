import * as Recharts from "recharts";
import formatDate from "date-fns/format";
import subDate from "date-fns/sub";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useUser } from "@auth0/nextjs-auth0";
import useUserClusters from "../../client-utils/useUserClusters";

const {
  Line,
  ComposedChart,
  ResponsiveContainer,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} = Recharts;
const convertValue = (value) => `$${Math.floor(value / 100)}`;
const convertDate = (timestamp) => {
  return formatDate(Number(timestamp), "dd MMM");
};
const BASE_SIZE_PER_CLUSTER = 1000;
const CHECKPOING_SIZE_PER_CLUSTER = 5;

const randomIntGenerator = (seed: number) => {
  return () => {
    seed = Math.sin(seed) * 10000;
    return Math.floor((seed - Math.floor(seed)) * 100);
  };
};

export default function SimpleChart() {
  const { user } = useUser();
  const useUserClustersSwr = useUserClusters(user.sub);
  const chartData = useMemo(() => {
    const { isLoading, isError, data } = useUserClustersSwr;
    if (isError || isLoading || !data?.clusterInfos) {
      return null;
    }
    const clusterCount = useUserClustersSwr.data.clusterInfos.length;
    const randomInt = randomIntGenerator(
      user.sub
        .split("")
        .reduce((res, current) => res + current.charCodeAt(0), 200)
    );
    const baseSize = BASE_SIZE_PER_CLUSTER * clusterCount;
    const NOW = Date.now();
    let lastDaySize = baseSize;
    const chartData = Array.from({ length: 15 }).map((_, index) => {
      const todayNewCheckpointCountPerCluster = randomInt();
      const todaySize =
        lastDaySize + todayNewCheckpointCountPerCluster * clusterCount;
      lastDaySize = todaySize;
      return {
        time: subDate(NOW, { days: 30 - index }),
        size: todaySize,
      };
    });
    return chartData;
  }, [useUserClustersSwr.data, useUserClustersSwr.isLoading]);

  if (!chartData || chartData.length === 0) {
    return null;
  }

  return (
    <Fragment>
      <div
        className="textMedium11Gray"
        style={{ marginBottom: 20, width: "100%" }}
      >
        Price in US Dollar
      </div>
      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer width="100%">
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#109CF1" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <XAxis
              tickCount={5}
              tickLine={false}
              axisLine={false}
              dataKey="time"
              tickFormatter={convertDate}
            />
            <YAxis
              width={50}
              tickLine={false}
              axisLine={false}
              tickFormatter={convertValue}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (!payload?.[0]?.payload) {
                  return null;
                }
                const { time, size } = payload?.[0]?.payload;
                return (
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #90A0B7",
                      padding: "10px",
                      borderRadius: 3,
                    }}
                  >
                    <div>{formatDate(time, "PPpp")}</div>
                    <div>Price: {convertValue(size)}</div>
                  </div>
                );
              }}
            />
            <CartesianGrid vertical={false} strokeDasharray="10" />

            <Line
              name="line"
              type="monotone"
              strokeLinecap="round"
              strokeWidth={2}
              // style={{ strokeDasharray: `40% 60%` }}
              dataKey="size"
              stroke="#109CF1"
              dot={false}
              legendType="none"
            />
            <Area
              type="monotone"
              dataKey="size"
              stroke="false"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorUv)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </Fragment>
  );
}
