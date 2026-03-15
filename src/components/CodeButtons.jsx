import { Copy, Check, Play, Pencil } from "lucide-react";

function CodeButtons({
   code,
   copiedCode,
   onCopy,
   onRun,
   isEditing,
   setIsEditing
}) {

   return (

      <div className="absolute top-2 right-2 flex gap-1 sm:gap-2">

         {/* Run */}

         <button
            onClick={onRun}
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
         >
            <Play size={14} className="sm:w-4 sm:h-4" />
         </button>

         {/* Copy */}

         <button
            onClick={() => onCopy(code)}
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
         >
            {copiedCode === code
               ? <Check size={14} className="sm:w-4 sm:h-4" />
               : <Copy size={14} className="sm:w-4 sm:h-4" />
            }
         </button>

         {/* Edit */}

         <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-200 hover:bg-gray-300 cursor-pointer"
         >
            <Pencil size={14} className="sm:w-4 sm:h-4" />
         </button>

      </div>

   );

}

export default CodeButtons;

 
 