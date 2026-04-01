function ProblemLeft({
   problem,
   leftView,
   running,
   submitStatus,
   isStopped,
   progress,
   progressTotal,
   liveLogs,
   logRef,
   failedCase,
   runResult,
   input,
   runOutput,
   setLeftView
}) {
   return (
      <div className="w-1/2 border-r bg-white relative">

         {/* LOADING OVERLAY */}
         {running && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
               <div className="flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-700 font-medium">
                     Running your code...
                  </p>
               </div>
            </div>
         )}

         {/* ================= PROBLEM VIEW ================= */}
         {leftView === "problem" && (
            <div className="p-6 space-y-6 overflow-y-auto h-full">

               <div className="space-y-1">
                  <h1 className="text-2xl font-bold text-gray-800">
                     {problem.title}
                  </h1>

                  <span
                     className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${problem.difficulty === "Easy"
                        ? "bg-green-100 text-green-700"
                        : problem.difficulty === "Medium"
                           ? "bg-yellow-100 text-yellow-700"
                           : "bg-red-100 text-red-700"
                        }`}
                  >
                     {problem.difficulty}
                  </span>
               </div>

               <div>
                  <h2 className="font-semibold text-lg mb-2 text-gray-700">
                     Description
                  </h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                     {problem.description}
                  </p>
               </div>

               <div className="space-y-4">
                  <h2 className="font-semibold text-lg text-gray-700">
                     Examples
                  </h2>

                  {problem.examples?.map((ex, index) => (
                     <div
                        key={index}
                        className="border rounded-xl p-4 bg-gray-50 shadow-sm space-y-3"
                     >
                        <p className="font-semibold text-gray-800">
                           Example {index + 1}
                        </p>

                        <div>
                           <p className="text-xs text-gray-500 mb-1">Input</p>
                           <div className="bg-white border p-3 rounded font-mono text-sm">
                              {ex.input}
                           </div>
                        </div>

                        <div>
                           <p className="text-xs text-gray-500 mb-1">Output</p>
                           <div className="bg-green-100 text-green-700 p-3 rounded font-mono text-sm">
                              {ex.output}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>

            </div>
         )}

         {/* ================= RUN VIEW ================= */}
         {leftView === "run" && (
            <div className="h-full flex flex-col">

               <div className="bg-gray-900 text-white p-3 flex justify-between">
                  <span>Result</span>
                  <button onClick={() => setLeftView("problem")}>✖</button>
               </div>

               <div className="p-5 overflow-y-auto">

                  {(submitStatus === "processing" || isStopped) && (
                     <div>

                        <p className="font-semibold text-lg mb-3">
                           Running Test Cases...
                        </p>

                        <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                           <div
                              className="bg-green-500 h-3 rounded-full transition-all"
                              style={{
                                 width: `${(progress / progressTotal) * 100 || 0}%`
                              }}
                           ></div>
                        </div>

                        <p className="text-green-600 font-bold mb-4">
                           {progress} / {progressTotal}
                        </p>

                        <div
                           ref={logRef}
                           className="bg-[#020617] p-4 rounded-lg font-mono text-sm border border-gray-800 h-64 overflow-y-auto space-y-1"
                        >
                           {liveLogs.map((log, i) => {
                              const isFail = log.includes("❌");

                              return (
                                 <div
                                    key={i}
                                    className={`${isFail ? "text-red-400 font-semibold" : "text-green-400"} ${!isStopped ? "animate-pulse" : ""}`}
                                 >
                                    {log}
                                 </div>
                              );
                           })}
                        </div>

                     </div>
                  )}

                  {failedCase && (
                     <div className="mt-6 border border-red-300 rounded-xl overflow-hidden shadow">
                        <div className="bg-red-100 text-red-700 px-4 py-2 font-semibold">
                           ❌ Failed Test Case {failedCase.index}
                        </div>

                        <div className="p-4 space-y-4 bg-white">

                           <div>
                              <p className="text-xs text-gray-500 mb-1">Input</p>
                              <div className="bg-gray-100 p-3 rounded font-mono text-sm">
                                 {failedCase.input}
                              </div>
                           </div>

                           <div>
                              <p className="text-xs text-gray-500 mb-1">Your Output</p>
                              <div className="bg-red-100 p-3 rounded font-mono text-sm text-red-600">
                                 {failedCase.output}
                              </div>
                           </div>

                           <div>
                              <p className="text-xs text-gray-500 mb-1">Expected Output</p>
                              <div className="bg-green-100 p-3 rounded font-mono text-sm text-green-700">
                                 {failedCase.expected}
                              </div>
                           </div>

                        </div>
                     </div>
                  )}

                  {submitStatus === "idle" && (
                     <div className="space-y-4">

                        <div className="flex items-center justify-between">
                           <p className="font-semibold text-lg">Run Result</p>

                           {runResult && (
                              <span
                                 className={`px-3 py-1 rounded text-xs font-semibold ${runResult.output === runResult.expected
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                    }`}
                              >
                                 {runResult.output === runResult.expected
                                    ? "✔ Passed"
                                    : "❌ Failed"}
                              </span>
                           )}
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                           <div className="bg-gray-100 px-3 py-1 text-xs text-gray-600">
                              Input
                           </div>
                           <div className="p-3 font-mono text-sm bg-white">
                              {runResult?.input || input || "No Input"}
                           </div>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                           <div className="bg-gray-100 px-3 py-1 text-xs text-gray-600">
                              Your Output
                           </div>
                           <div className="bg-[#020617] text-green-400 p-4 font-mono text-sm min-h-[80px]">
                              {runResult?.output || runOutput || "No Output"}
                           </div>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                           <div className="bg-gray-100 px-3 py-1 text-xs text-gray-600">
                              Expected Output
                           </div>
                           <div
                              className={`p-4 font-mono text-sm min-h-[80px] ${runResult?.output === runResult?.expected
                                 ? "bg-green-100 text-green-700"
                                 : "bg-red-100 text-red-700"
                                 }`}
                           >
                              {runResult?.expected}
                           </div>
                        </div>

                     </div>
                  )}

               </div>
            </div>
         )}
      </div>
   );
}

export default ProblemLeft;