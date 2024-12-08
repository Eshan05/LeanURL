import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic"; // Dynamically import ApexCharts
import { URLDocument } from "@/types/types";
import { Button } from "@components/ui/button";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// URL type with duplicate count
type URLWithDuplicateCount = URLDocument & { duplicateCount: number };

const AnalyticsDashboard: React.FC = () => {
  const [urls, setUrls] = useState<URLWithDuplicateCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<URLWithDuplicateCount | null>(null);

  const fetchUrls = async (): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch("/api/analytics");
      const data: URLDocument[] = await res.json();

      // Add duplicate counts
      const urlCountMap: Record<string, number> = data.reduce((acc, url) => {
        acc[url.originalUrl] = (acc[url.originalUrl] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      const processedData: URLWithDuplicateCount[] = data.map((url) => ({
        ...url,
        duplicateCount: urlCountMap[url.originalUrl] || 0,
      }));

      setUrls(processedData);
    } catch (err) {
      setError("Failed to fetch URLs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUrls();
  }, []);

  // Chart Data Generators
  const getHeatmapData = (accesses: URLDocument["accesses"]["lastAccessed"]) => {
    // Heatmap logic: Transform accesses to a month-day grid
    return Array(12)
      .fill(0)
      .map((_, month) => ({
        name: `Month ${month + 1}`,
        data: Array(31)
          .fill(0)
          .map((_, day) => ({
            x: `Day ${day + 1}`,
            y: accesses.filter(
              (access) =>
                new Date(access.date).getMonth() === month &&
                new Date(access.date).getDate() === day + 1
            ).length,
          })),
      }));
  };

  const getAreaChartData = (urls: URLWithDuplicateCount[]) => {
    return urls.slice(0, 5).map((url) => ({
      name: url.originalUrl,
      data: url.accesses.lastAccessed.map((access) => ({
        x: new Date(access.date).toLocaleDateString(),
        y: 1, // Replace with aggregated data if needed
      })),
    }));
  };

  const getTreeMapData = (urls: URLWithDuplicateCount[]) => {
    const browserCounts: Record<string, number> = {};

    urls.forEach((url) =>
      url.accesses.lastAccessed.forEach((access) => {
        const browser = /Chrome/i.test(access.userAgent)
          ? "Chrome"
          : /Firefox/i.test(access.userAgent)
            ? "Firefox"
            : /Safari/i.test(access.userAgent) && !/Chrome/i.test(access.userAgent)
              ? "Safari"
              : /Edge/i.test(access.userAgent)
                ? "Edge"
                : "Unknown";
        browserCounts[browser] = (browserCounts[browser] || 0) + 1;
      })
    );

    return Object.entries(browserCounts).map(([browser, count]) => ({
      x: browser,
      y: count,
    }));
  };

  const getRadarChartData = (accesses: URLDocument["accesses"]["lastAccessed"]) => {
    const hourData = new Array(24).fill(0);
    accesses.forEach((access) => {
      const hour = new Date(access.date).getHours();
      hourData[hour]++;
    });

    return [
      {
        name: "Hourly Access Count",
        data: hourData,
      },
    ];
  };

  return (
    <div className="container p-4 mx-auto space-y-6">
      {/* Loader/Error */}
      {loading && <p>Loading data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* URL Selector */}
      {!loading && !error && (
        <>
          <div>
            <h2>Select URL:</h2>
            <select
              value={selectedUrl?._id || ""}
              onChange={(e) =>
                setSelectedUrl(urls.find((url) => url._id === e.target.value) || null)
              }
              className="p-2 border"
            >
              <option value="">Select URL</option>
              {urls.map((url) => (
                <option key={url._id} value={url._id}>
                  {url.originalUrl}
                </option>
              ))}
            </select>
          </div>

          {/* Heatmap */}
          {selectedUrl && (
            <div>
              <h2>Heatmap</h2>
              <Chart
                type="heatmap"
                series={getHeatmapData(selectedUrl.accesses.lastAccessed)}
                options={{
                  chart: { type: "heatmap", height: 350 },
                  title: { text: "Heatmap of Activity" },
                }}
              />
            </div>
          )}

          {/* Area Chart */}
          <div>
            <h2>Area Chart for Last 5 URLs</h2>
            <Chart
              type="area"
              series={getAreaChartData(urls)}
              options={{
                chart: { type: "area", height: 350 },
                xaxis: { type: "datetime" },
                title: { text: "Access Trends for Last 5 URLs" },
              }}
            />
          </div>

          {/* Tree Map */}
          <div>
            <h2>Browser Distribution</h2>
            <Chart
              type="treemap"
              series={[{ data: getTreeMapData(urls) }]}
              options={{
                chart: { type: "treemap", height: 350 },
                title: { text: "Browser Usage Across URLs" },
              }}
            />
          </div>

          {/* Radar Chart */}
          {selectedUrl && (
            <div>
              <h2>Radar Chart for Accessed Hours</h2>
              <Chart
                type="radar"
                series={getRadarChartData(selectedUrl.accesses.lastAccessed)}
                options={{
                  chart: { type: "radar", height: 350 },
                  xaxis: { categories: Array.from({ length: 24 }, (_, i) => `${i}:00`) },
                  title: { text: "Most Accessed Hours" },
                }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
