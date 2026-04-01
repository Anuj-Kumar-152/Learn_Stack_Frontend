import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import CodeEditor from "./CodeEditor";
import ProblemLeft from "./ProblemLeft";

import { handleRunCode } from "./RunHandler";
import { handleSubmitCode } from "./SubmitHandler";

function ProblemDetail() {

   const { slug } = useParams();

   const [problem, setProblem] = useState(null);
   const [code, setCode] = useState("");
   const [input, setInput] = useState("");

   const [runOutput, setRunOutput] = useState("");
   const [runResult, setRunResult] = useState(null);

   const [running, setRunning] = useState(false);
   const [submitting, setSubmitting] = useState(false);

   const [leftView, setLeftView] = useState("problem");

   const [submitResult, setSubmitResult] = useState(null);
   const [submitStatus, setSubmitStatus] = useState("idle");
   const [failedCase, setFailedCase] = useState(null);

   const [progress, setProgress] = useState(0);
   const [progressTotal, setProgressTotal] = useState(0);

   const [liveLogs, setLiveLogs] = useState([]);
   const [isStopped, setIsStopped] = useState(false);

   const logRef = useRef(null);

   useEffect(() => {
      if (!slug) return;

      const fetchData = async () => {
         try {
            const [problemRes, bpRes] = await Promise.all([
               fetch(`${import.meta.env.VITE_BACKEND_URL}/api/problems/${slug}`),
               fetch(`${import.meta.env.VITE_BACKEND_URL}/api/problems/boilerplate/${slug}`)
            ]);

            const data = await problemRes.json();
            const bpData = await bpRes.json();

            setProblem(data);

            // 🔥 LOCAL STORAGE LOAD FIX
            const savedCode = localStorage.getItem(`code-${slug}`);

            setCode(
               savedCode ||
               bpData?.boilerplate ||
               data?.boilerplate?.java ||
               "// write your code here"
            );

            setInput(data.examples?.[0]?.input || "");

         } catch (err) {
            console.log("🔥 FETCH ERROR:", err);
            setCode("// write your code here");
         }
      };

      fetchData();
   }, [slug]);

   // 🔥 AUTO SAVE CODE
   useEffect(() => {
      if (code) {
         localStorage.setItem(`code-${slug}`, code);
      }
   }, [code, slug]);

   useEffect(() => {
      if (logRef.current) {
         logRef.current.scrollTop = logRef.current.scrollHeight;
      }
   }, [liveLogs]);

   if (!problem) return <p className="text-center mt-20">Loading...</p>;

   return (
      <div className="flex h-[calc(100vh-64px)] mt-16">

         {/* LEFT SIDE */}
         <ProblemLeft
            problem={problem}
            leftView={leftView}
            running={running}
            submitStatus={submitStatus}
            isStopped={isStopped}
            progress={progress}
            progressTotal={progressTotal}
            liveLogs={liveLogs}
            logRef={logRef}
            failedCase={failedCase}
            runResult={runResult}
            input={input}
            runOutput={runOutput}
            setLeftView={setLeftView}
         />

         {/* RIGHT */}
         <div className="w-1/2 flex flex-col bg-[#0f172a] text-white">

            <div className="flex justify-between p-3 border-b border-gray-700">
               <span>Java</span>

               <div className="flex gap-2">

                  <button
                     onClick={() => {
                        setSubmitStatus("idle");
                        setFailedCase(null);
                        setLiveLogs([]);
                        setIsStopped(false);
                        setRunResult(null);

                        handleRunCode({
                           code,
                           input,
                           slug,
                           problem,
                           setRunning,
                           setLeftView,
                           setSubmitStatus,
                           setSubmitResult,
                           setFailedCase,
                           setRunOutput,
                           setRunResult
                        });
                     }}
                     disabled={running || submitting}
                     className="bg-indigo-600 px-4 py-2 rounded"
                  >
                     {running ? "Running..." : "Run"}
                  </button>

                  <button
                     onClick={() =>
                        handleSubmitCode({
                           code,
                           slug,
                           problem,
                           setSubmitting,
                           setLeftView,
                           setRunOutput,
                           setSubmitStatus,
                           setSubmitResult,
                           setFailedCase,
                           setProgress,
                           setProgressTotal,
                           setLiveLogs,
                           setIsStopped
                        })
                     }
                     disabled={submitting || running}
                     className="bg-green-600 px-4 py-2 rounded"
                  >
                     Submit
                  </button>

               </div>
            </div>

            <div className="flex-1">
               <CodeEditor
                  key={slug}
                  code={code}
                  setCode={setCode}
                  language="java"
                  problem={problem}
               />
            </div>

         </div>

      </div>
   );
}

export default ProblemDetail;











// import { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import CodeEditor from "./CodeEditor";
// import ProblemLeft from "./ProblemLeft";

// import { handleRunCode } from "./RunHandler";
// import { handleSubmitCode } from "./SubmitHandler";

// function ProblemDetail() {

//    const { slug } = useParams();

//    const [problem, setProblem] = useState(null);
//    const [code, setCode] = useState("");
//    const [input, setInput] = useState("");

//    const [runOutput, setRunOutput] = useState("");
//    const [runResult, setRunResult] = useState(null);

//    const [running, setRunning] = useState(false);
//    const [submitting, setSubmitting] = useState(false);

//    const [leftView, setLeftView] = useState("problem");

//    const [submitResult, setSubmitResult] = useState(null);
//    const [submitStatus, setSubmitStatus] = useState("idle");
//    const [failedCase, setFailedCase] = useState(null);

//    const [progress, setProgress] = useState(0);
//    const [progressTotal, setProgressTotal] = useState(0);

//    const [liveLogs, setLiveLogs] = useState([]);
//    const [isStopped, setIsStopped] = useState(false);

//    const logRef = useRef(null);

//    useEffect(() => {
//       if (!slug) return;

//       const fetchData = async () => {
//          try {
//             // 🔥 FIX: parallel fetch (no logic change)
//             const [problemRes, bpRes] = await Promise.all([
//                fetch(`${import.meta.env.VITE_BACKEND_URL}/api/problems/${slug}`),
//                fetch(`${import.meta.env.VITE_BACKEND_URL}/api/problems/boilerplate/${slug}`)
//             ]);

//             const data = await problemRes.json();
//             const bpData = await bpRes.json();

//             setProblem(data);

//             // 🔥 SAME LOGIC (just safer)
//             setCode(
//                bpData?.boilerplate ||
//                data?.boilerplate?.java ||
//                "// write your code here"
//             );

//             setInput(data.examples?.[0]?.input || "");

//          } catch (err) {
//             console.log("🔥 FETCH ERROR:", err);

//             // fallback (safe)
//             setCode("// write your code here");
//          }
//       };

//       fetchData();
//    }, [slug]);

//    useEffect(() => {
//       if (logRef.current) {
//          logRef.current.scrollTop = logRef.current.scrollHeight;
//       }
//    }, [liveLogs]);

//    if (!problem) return <p className="text-center mt-20">Loading...</p>;

//    return (
//       <div className="flex h-[calc(100vh-64px)] mt-16">

//          {/* LEFT SIDE */}
//          <ProblemLeft
//             problem={problem}
//             leftView={leftView}
//             running={running}
//             submitStatus={submitStatus}
//             isStopped={isStopped}
//             progress={progress}
//             progressTotal={progressTotal}
//             liveLogs={liveLogs}
//             logRef={logRef}
//             failedCase={failedCase}
//             runResult={runResult}
//             input={input}
//             runOutput={runOutput}
//             setLeftView={setLeftView}
//          />

//          {/* RIGHT */}
//          <div className="w-1/2 flex flex-col bg-[#0f172a] text-white">

//             <div className="flex justify-between p-3 border-b border-gray-700">
//                <span>Java</span>

//                <div className="flex gap-2">

//                   <button
//                      onClick={() => {
//                         setSubmitStatus("idle");
//                         setFailedCase(null);
//                         setLiveLogs([]);
//                         setIsStopped(false);
//                         setRunResult(null);

//                         handleRunCode({
//                            code,
//                            input,
//                            slug,
//                            problem,
//                            setRunning,
//                            setLeftView,
//                            setSubmitStatus,
//                            setSubmitResult,
//                            setFailedCase,
//                            setRunOutput,
//                            setRunResult
//                         });
//                      }}
//                      disabled={running || submitting}
//                      className="bg-indigo-600 px-4 py-2 rounded"
//                   >
//                      {running ? "Running..." : "Run"}
//                   </button>

//                   <button
//                      onClick={() =>
//                         handleSubmitCode({
//                            code,
//                            slug,
//                            problem,
//                            setSubmitting,
//                            setLeftView,
//                            setRunOutput,
//                            setSubmitStatus,
//                            setSubmitResult,
//                            setFailedCase,
//                            setProgress,
//                            setProgressTotal,
//                            setLiveLogs,
//                            setIsStopped
//                         })
//                      }
//                      disabled={submitting || running}
//                      className="bg-green-600 px-4 py-2 rounded"
//                   >
//                      Submit
//                   </button>

//                </div>
//             </div>

//             <div className="flex-1">
//                <CodeEditor
//                   key={slug}
//                   code={code}
//                   setCode={setCode}
//                   language="java"
//                   problem={problem}
//                />
//             </div>

//          </div>

//       </div>
//    );
// }

// export default ProblemDetail;





 