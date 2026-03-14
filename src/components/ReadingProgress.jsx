function ReadingProgress({ progress }) {

   return (

      <div className="w-full pr-2 sm:pr-4">

         <div className="flex justify-between items-center text-xs sm:text-sm text-gray-500 mb-1">

            <span>Reading Progress</span>

            <span className="font-medium">
               {progress}%
            </span>

         </div>

         <div className="w-full h-2 bg-gray-200 rounded">

            <div
               className="h-2 bg-indigo-600 rounded transition-all duration-300"
               style={{ width: `${progress}%` }}
            />

         </div>

      </div>

   )

}

export default ReadingProgress;


 
 