"use client";

import dynamic from "next/dynamic"; // Dynamically import ApexCharts
import Image from "next/image";

import { GradientTop, Nav, toast, SearchUrls } from "@/components";
import { Button, Select, SelectContent, SelectIcon, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/ui-index";
import { useAuthen } from "@/hooks/useAuthen";
import { URLDocument, URLWithDuplicateCount } from "@/types/types";
import { ChevronDown, ExternalLinkIcon, LinkIcon, RefreshCcw, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const Visualize: React.FC = () => {
  const authenticated = useAuthen();

  const [urls, setUrls] = useState<URLWithDuplicateCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedUrl, setSelectedUrl] = useState<URLWithDuplicateCount | null>(null);
  const [timeframe, setTimeframe] = useState<string>("week"); // Or 'month', 'year'

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshData = () => {
    setLoading(true);
    fetchUrls();
    toast.success('Data refreshed successfully!');
  };

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
            x: `${day + 1}`,
            y: accesses.filter(
              (access) =>
                new Date(access.date).getMonth() === month &&
                new Date(access.date).getDate() === day + 1
            ).length,
          })),
      }));
  };

  const getStartDate = (timeframe: string): Date => {
    const now = new Date();
    if (timeframe === "month") {
      return new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (timeframe === "year") {
      return new Date(now.getFullYear(), 0, 1);
    }
    // Default to "week"
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    return startOfWeek;
  };

  const getAreaChartData = (urls: URLWithDuplicateCount[], timeframe: string) => {
    const startDate = getStartDate(timeframe);

    const totalClicksByDate: Record<string, number> = {};

    urls.forEach((url) => {
      url.accesses.lastAccessed
        .filter((access) => new Date(access.date) >= startDate)
        .forEach((access) => {
          const date = new Date(access.date).toLocaleDateString();
          totalClicksByDate[date] = (totalClicksByDate[date] || 0) + 1;
        });
    });

    return Object.entries(totalClicksByDate).map(([date, count]) => ({
      x: date,
      y: count,
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

  const handleSearchMobile = () => {
    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
    });
    document.dispatchEvent(event);
  }

  if (!authenticated) {
    return null;
  }

  return (
    <main className="relative overflow-x-hidden flex flex-col items-center justify-center h-screen font-inter min-h-svh bg-zinc-50 dark:bg-[#09090b] c-beige:bg-beige-100">
      <div className='relative hidden'>
        <GradientTop />
      </div>
      <SearchUrls />
      <Nav />
      <Button size="icon" variant='secondary' className="fixed backdrop-blur bg-[#fffa] z-10 shadow rounded-full bottom-4 border left-4 dark:bg-[#09090b]" onClick={refreshData}>
        <RefreshCcw className="w-4 h-4 text-black dark:text-white" />
      </Button>
      <div className="relative w-full py-24 overflow-x-hidden">

        <div className="w-full px-[1.15rem] py-10 mx-auto lg:px-8 lg:py-16">
          <p className='mb-2 font-mono text-center small-caps c-beige:text-beige-800'>LeanURL</p>
          <header className="relative flex flex-col items-center justify-center w-full mb-10 space-y-10 overflow-hidden">
            <h1 className="text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl c-beige:text-beige-800">
              Visualize
            </h1>
            <section className="flex items-center justify-center space-x-2">
              <Button type="button" variant="outline" className="flex" onClick={handleSearchMobile}>
                <span className="flex w-4 aspect-square">
                  <SearchIcon />
                </span>
              </Button>
              <Select
                value={selectedUrl?._id || ""}
                onValueChange={(value: string) =>
                  setSelectedUrl(urls.find((url) => url._id === value) || null)
                }
              >
                <SelectTrigger className="lg:max-w-[50%] min-w-[200px] w-max max-w-[300px] focus-visible:ring-0 focus-visible:outline-none focus:ring-0 focus:ring-offset-0">
                  <SelectValue placeholder="Select URL" />
                  <SelectIcon asChild>
                    <ChevronDown className='w-4 h-4 ml-4 opacity-50' />
                  </SelectIcon>
                </SelectTrigger>
                <SelectContent>
                  {urls.map((url) => (
                    <SelectItem key={url._id} value={url._id}>
                      {url.shortenUrl}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </section>
            <footer className="*:flex *:items-center *:space-x-4 flex flex-col space-y-2 text-xs">
              <p><LinkIcon className="w-5 h-5" /><span className="inline-block px-3 py-1.5 font-mono border rounded-lg text-primary hover:underline overflow-x-auto max-w-[128px] scrollbar-none whitespace-nowrap c-beige:text-beige-700">{selectedUrl?.shortenUrl}</span></p>
              <p> <ExternalLinkIcon className="w-5 h-5" /><span className="inline-block px-3 py-1.5 font-mono border rounded-lg text-primary hover:underline overflow-x-auto max-w-[128px] scrollbar-none whitespace-nowrap c-beige:text-beige-700">{selectedUrl?.originalUrl}</span></p>
            </footer>
          </header>
          {loading &&
            <div className='flex items-center justify-center w-full py-5'>
              <Image src="/images/bars-scale.svg"
                width={20} height={20}
                className="dark:invert"
                alt="..." />
            </div>}
          {error && <p className="text-red-500">{error}</p>}

          {/* URL Selector */}
          {!loading && !error && (
            <main className="w-full *:w-full flex flex-col gap-4">
              {/* Timeframe Selector */}
              <section className="flex flex-col gap-4 lg:flex-row *:flex-1">
                {/* Area Chart */}
                <div className="graph-card">
                  <h2 className="mb-2">Clicks per Day</h2>
                  <Select
                    value={timeframe}
                    onValueChange={(value) => setTimeframe(value)}
                  >
                    <SelectTrigger className="w-40 mt-4">
                      <SelectValue placeholder="Select Timeframe" />
                      <SelectIcon asChild>
                        <ChevronDown className="w-4 h-4 opacity-50" />
                      </SelectIcon>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="mt-2">The following chart shows the total number of clicks for each day. You can use scroll to expand on the X axis. It shows clicks for the current week accumulated by all the URLs.</p>
                  <Chart
                    type="area"
                    height="365"
                    series={[
                      {
                        name: "Total Clicks",
                        data: getAreaChartData(urls, timeframe),
                      },
                    ]}
                    options={{
                      chart: { type: "area", height: 350, fontFamily: 'monospace' },
                      xaxis: { type: "datetime" },
                      colors: ['#1E90FF', '#FF6347', '#32CD32', '#FFD700'],
                      title: { text: "Total clicks" },
                      dataLabels: {
                        enabled: true,
                        formatter: (val: number) => `${val}`,
                      },
                    }}
                  />
                </div>
                { /* Tree Map */}
                <div className="graph-card">
                  <h2 className="">Browser Distribution</h2>
                  <p className="">The following treemap shows the distribution of browser usage. It is the cumulative distribution of browser usage for all the URLs. You can see for individual URLs in a tabular form back on analytics.</p>
                  <Chart
                    type="treemap"
                    series={[{ data: getTreeMapData(urls) }]}
                    options={{
                      chart: { type: "treemap", height: 350, fontFamily: 'monospace', background: '0', foreColor: '#444' },
                      title: { text: "Browser Usage" },
                      colors: ['#1E90FFaa', '#FF6347aa', '#32CD32aa', '#FFD700aa'],
                      plotOptions: {
                        treemap: {
                          enableShades: false,
                          shadeIntensity: 0.5,
                          distributed: true,
                        }
                      },
                      grid: { show: false },
                      stroke: { width: 2, show: false, lineCap: "round" },
                    }}
                  />
                </div>
              </section>
              <section className="flex flex-col gap-4">
                <header className="flex-col hidden gap-2">
                  <h2 className="text-base font-bold lg:text-lg text-muted-foreground c-beige:text-beige-700/60">Select URL:</h2>
                </header>
                <article className="flex flex-col gap-4 xl:flex-row w-full *:flex-1">
                  {/* Heatmap */}
                  {selectedUrl && (
                    <div className="graph-card">
                      <h2 className="">Heatmap ({selectedUrl.accesses.count} Total)</h2>
                      <p className="">The heatmap shows the activity of the selected URL. It displays the number of clicks on each day over the entire year. Columns are days and rows are months, the colors are increasing in contrast as per clicks. Hover for total clicks.</p>
                      <Chart
                        type="heatmap"
                        width="770"
                        height="365"
                        series={getHeatmapData(selectedUrl.accesses.lastAccessed)}
                        options={{
                          chart: { type: "heatmap", height: 350, background: 'transparent', fontFamily: 'monospace' },
                          title: { text: "Heatmap of Activity" },
                          plotOptions: {
                            heatmap: {
                              radius: 4,
                              useFillColorAsStroke: false,
                              colorScale: {
                                ranges: [{
                                  from: 1,
                                  to: 10,
                                  color: '#fdf156',
                                  name: 'Low',
                                }, {
                                  from: 11,
                                  to: 30,
                                  color: '#ffc722',
                                  name: 'Medium',
                                }, {
                                  from: 31,
                                  to: 60,
                                  color: '#ff9711',
                                  name: 'High',
                                }, {
                                  from: 61,
                                  to: 100,
                                  color: '#04001a',
                                  name: 'Century',
                                }],
                              }
                            },
                          },
                          dataLabels: { enabled: false, },
                          markers: {
                            strokeWidth: 0,
                            fillOpacity: 0,
                            strokeOpacity: 0,
                            showNullDataPoints: false
                          },
                          grid: { show: false },
                          tooltip: { shared: true, }
                        }}
                      />

                    </div>
                  )}

                  {/* Radar Chart */}
                  {selectedUrl && (
                    <div className="graph-card">
                      <h2 className="">Radar Chart</h2>
                      <p className="">The following radar chart displays the most accessed hours for the selected URL. It goes over the entire day, from 00:00 to 23:59 and spans over the entire lifetime of the URL.</p>
                      <div className="flex items-center justify-center p-4 bg-transparent scrollbar-none min-w-[370px] min-h-[370px]">
                        <Chart
                          type="radar"
                          width="365"
                          height="365"
                          series={getRadarChartData(selectedUrl.accesses.lastAccessed)}
                          options={{
                            chart: { type: "radar", height: 350, fontFamily: 'monospace' },
                            xaxis: { categories: Array.from({ length: 24 }, (_, i) => `${i}:00`) },
                            title: { text: "Most Accessed Hours" },
                            colors: ['#fdf156', '#ffc722', '#ff9711', '#04001a'],
                          }}
                        />
                      </div>
                    </div>
                  )}
                </article>
              </section>
            </main>
          )}
        </div>
      </div>
    </main>
  );
};

export default Visualize;
