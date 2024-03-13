import { useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
  Brush,
} from "recharts";
import PropTypes from "prop-types";

import "./SynchronizedLineChart.css";

const SynchronizedLineChart = ({ yearly, monthly, weekly, daily }) => {
  const [hoveredChart, setHoveredChart] = useState(null);

  const customTooltipFormatter = (value) => {
    return [`orders: ${value}`];
  };

  return (
    <div style={{ width: "100%" }} id="sales-chart">
      <h4>Daily</h4>
      <div id="daily-chart">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            width={500}
            height={200}
            data={daily}
            syncId="anyId"
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            cursor="pointer"
            onMouseMove={() => setHoveredChart("daily")}
            onMouseLeave={() => setHoveredChart(null)}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            {hoveredChart === "daily" && (
              <Tooltip formatter={customTooltipFormatter} />
            )}
            <Area
              type="monotone"
              dataKey="pv"
              stroke="#f2c85b"
              fill="#f2c85bcc"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <h4>Weekly</h4>
      <div id="weekly-chart">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            width={500}
            height={200}
            data={weekly}
            syncId="anyId"
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            cursor="pointer"
            onMouseMove={() => setHoveredChart("weekly")}
            onMouseLeave={() => setHoveredChart(null)}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            {hoveredChart === "weekly" && (
              <Tooltip formatter={customTooltipFormatter} />
            )}
            <Area
              type="monotone"
              dataKey="pv"
              stroke="#a020f0"
              fill="#a020f0cc"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <h4>Monthly</h4>
      <div id="monthly-chart">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            width={500}
            height={200}
            data={monthly}
            syncId="anyId"
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            cursor="pointer"
            onMouseMove={() => setHoveredChart("monthly")}
            onMouseLeave={() => setHoveredChart(null)}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            {hoveredChart === "monthly" && (
              <Tooltip formatter={customTooltipFormatter} />
            )}
            <Area
              type="monotone"
              dataKey="pv"
              stroke="#808080"
              fill="#808080cc"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <h4>Yearly</h4>
      <div id="yearly-chart">
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart
            width={500}
            height={200}
            data={yearly}
            syncId="anyId"
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            cursor="pointer"
            onMouseMove={() => setHoveredChart("yearly")}
            onMouseLeave={() => setHoveredChart(null)}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            {hoveredChart === "yearly" && (
              <Tooltip formatter={customTooltipFormatter} />
            )}
            <Area
              type="monotone"
              dataKey="pv"
              stroke="#fa1e4e"
              fill="#fa1e4ecc"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

SynchronizedLineChart.propTypes = {
  yearly: PropTypes.array.isRequired,
  monthly: PropTypes.array.isRequired,
  weekly: PropTypes.array.isRequired,
  daily: PropTypes.array.isRequired,
};

export default SynchronizedLineChart;
