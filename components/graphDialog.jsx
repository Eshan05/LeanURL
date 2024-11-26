import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@components/ui/dialog';
import { Button } from '@components/ui/button';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const AccessGraphDialog = ({ open, setOpen, recentAccesses }) => {
  const groupByWeek = (accesses) => {
    const weeks = {};

    accesses.forEach((access) => {
      const date = new Date(access);
      const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay())); // Start of the week (Sunday)

      const weekKey = `${startOfWeek.getFullYear()}-W${Math.ceil((startOfWeek.getDate() - 1) / 7)}`;
      if (!weeks[weekKey]) {
        weeks[weekKey] = { week: weekKey, count: 0 };
      }
      weeks[weekKey].count += 1;
    });

    // Convert the object to an array and sort by week
    return Object.values(weeks).sort((a, b) => new Date(a.week) - new Date(b.week));
  };

  const weeklyAccesses = groupByWeek(recentAccesses);
  // Prepare the data for the graph
  const graphData = {
    series: [
      {
        name: 'Accesses',
        data: weeklyAccesses.map((weekData) => ({
          x: weekData.week,
          y: weekData.count,
        })),
      },
    ],
    options: {
      chart: {
        type: 'line', // Line chart type
        height: 350,
      },
      xaxis: {
        type: 'category',
        categories: weeklyAccesses.map((weekData) => weekData.week),
        title: {
          text: 'Week',
        },
      },
      yaxis: {
        title: {
          text: 'Accesses',
        },
        stepSize: 10,
        min: 0,
      },
      title: {
        text: 'Weekly Accesses',
        align: 'center',
      },
      stroke: {
        curve: 'smooth',
      },
      markers: {
        size: 5,
        colors: ['#FF4560'],
        strokeColors: '#fff',
        strokeWidth: 1,
      },
      dataLabels: {
        enabled: true,
      },
    },
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} className="w-1/2">
      <DialogContent className="hidden h-2/3 lg:block max-w-[80%]">
        <DialogHeader>
          <DialogTitle>Weekly Access Graph</DialogTitle>
        </DialogHeader>

        <section className="h-full p-3 overflow-auto">
          <div className="w-full mt-3 bg-gray-100 dark:bg-[#0c0e0f] rounded-lg">
            <Chart
              options={graphData.options}
              series={graphData.series}
              type="line"
              height="350"
            />
          </div>
        </section>
        <DialogFooter>
          <DialogClose asChild>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AccessGraphDialog;
