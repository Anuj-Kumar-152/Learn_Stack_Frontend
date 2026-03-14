function CompletionMessage({ title }) {

   return (

      <div className="mt-4 p-3 sm:p-4 rounded-lg bg-green-50 border border-green-200">

         <h3 className="font-semibold text-green-700 mb-1 text-sm sm:text-base flex items-center gap-2">
            🎉 Congratulations!
         </h3>

         <p className="text-xs sm:text-sm text-green-700 leading-relaxed">
            You have successfully completed <strong>{title}</strong>.
         </p>

      </div>

   )

}

export default CompletionMessage;


 
 