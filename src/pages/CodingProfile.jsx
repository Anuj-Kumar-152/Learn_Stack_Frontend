import { useMemo, useState } from "react";

function CodingProfile({ user }) {
   const [hover, setHover] = useState(null);
   const [year, setYear] = useState(new Date().getFullYear());

   // DATA
   const activity = useMemo(() => {
      const map = {};
      const start = new Date(year, 0, 1);
      const end = new Date(year, 11, 31);

      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
         const key = d.toISOString().slice(0, 10);
         map[key] = Math.floor(Math.random() * 5);
      }

      return map;
   }, [year]);

   const maxCount = Math.max(...Object.values(activity));

   const getColor = (count) => {
      if (count === 0) return "bg-gray-100";

      const intensity = count / maxCount;

      if (intensity < 0.25) return "bg-green-100";
      if (intensity < 0.5) return "bg-green-300";
      if (intensity < 0.75) return "bg-green-500";
      return "bg-green-700";
   };

   // WEEKDAYS
   const weekdays = ["S", "M", "T", "W", "T", "F", "S"];

   // GRID LOGIC (same)
   const start = new Date(year, 0, 1);
   const end = new Date(year, 11, 31);

   const days = [];
   for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
   }

   const firstDayOffset = start.getDay();
   const totalCells = firstDayOffset + days.length;

   const cells = Array.from({ length: totalCells }, (_, i) => {
      if (i < firstDayOffset) return null;
      return days[i - firstDayOffset];
   });

   const weeks = [];
   for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
   }

   // MONTH POSITION (pixel perfect using index)
   const monthPositions = {};
   weeks.forEach((week, i) => {
      const firstValid = week.find(d => d);
      if (!firstValid) return;

      const m = firstValid.getMonth();
      if (!(m in monthPositions)) {
         monthPositions[m] = i;
      }
   });

   const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
   ];

   return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-md p-5">

         {/* HEADER */}
         <div className="flex justify-between mb-5">
            <div>
               <h3 className="text-lg font-semibold text-gray-800">
                  Activity Overview
               </h3>
               <p className="text-sm text-gray-500">
                  Submissions in {year}
               </p>
            </div>

            <select
               value={year}
               onChange={(e) => setYear(Number(e.target.value))}
               className="border px-3 py-1.5 rounded-md"
            >
               {[2026, 2025, 2024].map(y => (
                  <option key={y}>{y}</option>
               ))}
            </select>
         </div>

         {/* SCROLL CONTAINER (IMPORTANT FIX) */}
         <div className="overflow-x-auto">

            <div className="inline-block min-w-max">

               {/* MONTHS */}
               <div className="flex ml-10 mb-2 text-xs text-gray-400">
                  {weeks.map((_, i) => {
                     const monthIndex = Object.keys(monthPositions).find(
                        key => monthPositions[key] === i
                     );

                     return (
                        <div key={i} className="w-[20px] text-left">
                           {monthIndex ? monthNames[monthIndex] : ""}
                        </div>
                     );
                  })}
               </div>

               <div className="flex">

                  {/* WEEKDAYS */}
                  <div className="flex flex-col mr-2 text-xs text-gray-400">
                     {weekdays.map((d, i) => (
                        <div key={i} className="h-[18px] flex items-center">
                           {d}
                        </div>
                     ))}
                  </div>

                  {/* GRID */}
                  <div className="flex gap-[4px]">
                     {weeks.map((week, wi) => (
                        <div key={wi} className="flex flex-col gap-[4px]">
                           {week.map((day, di) => {
                              if (!day) {
                                 return <div key={di} className="w-[16px] h-[16px]" />;
                              }

                              const date = day.toISOString().slice(0, 10);
                              const count = activity[date];

                              return (
                                 <div
                                    key={di}
                                    onMouseEnter={(e) =>
                                       setHover({
                                          x: e.clientX,
                                          y: e.clientY,
                                          date,
                                          count
                                       })
                                    }
                                    onMouseLeave={() => setHover(null)}
                                    className={`w-[16px] h-[16px] rounded-sm hover:scale-110 transition ${getColor(count)}`}
                                 />
                              );
                           })}
                        </div>
                     ))}
                  </div>

               </div>

            </div>

         </div>

         {/* LEGEND */}
         <div className="flex justify-end mt-4 text-xs text-gray-500 gap-2">
            <span>Less</span>
            {[0, 1, 2, 3, 4].map(i => (
               <div key={i} className={`w-3 h-3 ${getColor(i)}`} />
            ))}
            <span>More</span>
         </div>

         {/* TOOLTIP */}
         {hover && (
            <div
               className="fixed bg-black text-white text-xs px-2 py-1 rounded"
               style={{
                  top: hover.y - 40,
                  left: hover.x - 20
               }}
            >
               {hover.count} submissions <br />
               {hover.date}
            </div>
         )}
      </div>
   );
}

export default CodingProfile;