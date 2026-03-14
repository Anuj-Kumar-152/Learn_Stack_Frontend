import { useState, useEffect } from "react";

function ImageSlider({ images }) {

   const [index, setIndex] = useState(0);
   const [playing, setPlaying] = useState(false);

   const next = () => {
      setIndex((prev) => (prev + 1) % images.length);
   };

   const prev = () => {
      setIndex((prev) => (prev - 1 + images.length) % images.length);
   };

   useEffect(() => {

      if (!playing) return;

      const interval = setInterval(() => {
         next();
      }, 5000);

      return () => clearInterval(interval);

   }, [playing]);

   return (

      <div className="w-full max-w-3xl mx-auto my-6 sm:my-8 px-2 sm:px-0">

         {/* Slider */}

         <div className="overflow-hidden rounded-lg shadow">

            <div
               className="flex transition-transform duration-500 ease-in-out"
               style={{ transform: `translateX(-${index * 100}%)` }}
            >

               {images.map((img, i) => (

                  <img
                     key={i}
                     src={img}
                     alt={`slide-${i}`}
                     className="w-full flex-shrink-0 object-contain"
                  />

               ))}

            </div>

         </div>


         {/* Controls */}

         <div className="flex justify-center items-center gap-3 sm:gap-4 mt-4 flex-wrap">

            {/* Left */}

            <button
               onClick={prev}
               className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
               &lt;
            </button>


            {/* Play / Pause */}

            <button
               onClick={() => setPlaying(!playing)}
               className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-gray-800 text-white hover:bg-gray-700 transition"
            >
               {playing ? "||" : "▶"}
            </button>


            {/* Right */}

            <button
               onClick={next}
               className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition"
            >
               &gt;
            </button>


            {/* Counter */}

            <span className="text-xs sm:text-sm text-gray-500 sm:ml-6">
               {index + 1} / {images.length}
            </span>

         </div>

      </div>

   );
}

export default ImageSlider;

 
 