import { X } from "lucide-react";
import { useEffect } from "react";

function OutputBox({ output, onClose }) {

   if (!output) return null;

   // auto close after 15 seconds
   useEffect(() => {

      const timer = setTimeout(() => {
         onClose();
      }, 15000);

      return () => clearTimeout(timer);

   }, [output, onClose]);

   return (

      <div className="bg-white rounded-md p-3 sm:p-4 mt-2 text-xs sm:text-sm relative">

         <button
            onClick={onClose}
            className="absolute top-2 right-2 sm:right-3 cursor-pointer text-gray-500 hover:text-black"
         >
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
         </button>

         <div className="font-semibold text-xs sm:text-sm mb-1">
            Output:
         </div>

         <pre className="whitespace-pre-wrap break-words text-xs sm:text-sm overflow-x-auto">
            {output}
         </pre>

      </div>

   );

}

export default OutputBox;



 





 