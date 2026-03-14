import React from "react";

const Loader = () => {
   return (

      <div className="flex items-center justify-center h-full py-20">

         <div className="flex items-center gap-2 sm:gap-3">

            <span className="loading loading-bars loading-xs"></span>
            <span className="loading loading-bars loading-sm"></span>
            <span className="loading loading-bars loading-md"></span>
            <span className="loading loading-bars loading-lg"></span>
            <span className="loading loading-bars loading-xl"></span>

         </div>

      </div>

   );
};

export default Loader;



 
 