const handleSubmitCode = async ({
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
}) => {

   let eventSource = null;

   try {
      setSubmitting(true);
      setLeftView("run");

      setRunOutput("");
      setSubmitStatus("processing");
      setSubmitResult(null);
      setFailedCase(null);

      setLiveLogs([]);
      setIsStopped(false);

      const totalTC = problem.testCases?.length || 0;

      setProgress(0);
      setProgressTotal(totalTC);

      const encodedCode = encodeURIComponent(code.trim());

      const url = `${import.meta.env.VITE_BACKEND_URL}/api/submit?code=${encodedCode}&slug=${slug}`;

      eventSource = new EventSource(url);

      let lastProgress = 0;

      eventSource.onmessage = (event) => {
         try {
            const data = JSON.parse(event.data);

            if (data.type === "progress") {
               const logLine = `✔ Passed: ${data.passed}/${data.total ?? totalTC}`;
               setLiveLogs(prev => [...prev, logLine]);

               if (data.passed > lastProgress) {
                  lastProgress = data.passed;
                  setProgress(data.passed);
                  setProgressTotal(data.total ?? totalTC);
               }
               return;
            }

            if (data.status === "Wrong Answer ❌") {
               setIsStopped(true);

               setLiveLogs(prev => [
                  ...prev,
                  `❌ Failed at Test Case ${data.failedCase?.index}`
               ]);

               setFailedCase(data.failedCase);
               setSubmitResult(data);
               setSubmitStatus("done");

               setProgress(data.passed);

               eventSource.close();
               return;
            }

            if (data.status === "Accepted ✔") {
               setIsStopped(true);

               setLiveLogs(prev => [
                  ...prev,
                  "🎉 All Test Cases Passed!"
               ]);

               setSubmitResult(data);
               setSubmitStatus("done");

               setProgress(data.passed);

               eventSource.close();
               return;
            }

         } catch (e) {
            console.log(e);
         }
      };

      eventSource.onerror = () => {
         if (eventSource) eventSource.close();
         setSubmitStatus("done");
      };

   } catch (err) {
      console.log(err);
      setSubmitStatus("done");
   } finally {
      setSubmitting(false);
   }
};

export { handleSubmitCode };







// const handleSubmitCode = async ({
//    code,
//    slug,
//    problem,
//    setSubmitting,
//    setLeftView,
//    setRunOutput,
//    setSubmitStatus,
//    setSubmitResult,
//    setFailedCase,
//    setProgress,
//    setProgressTotal,

//    // 🔥 NEW
//    setLiveLogs
// }) => {

//    let eventSource = null;

//    try {
//       setSubmitting(true);
//       setLeftView("run");

//       setRunOutput("");
//       setSubmitStatus("processing");
//       setSubmitResult(null);
//       setFailedCase(null);

//       // 🔥 RESET LOGS
//       setLiveLogs([]);

//       const totalTC = problem.testCases?.length || 0;

//       setProgress(0);
//       setProgressTotal(totalTC);

//       const encodedCode = encodeURIComponent(code.trim());

//       const url = `${import.meta.env.VITE_BACKEND_URL}/api/submit?code=${encodedCode}&slug=${slug}`;

//       console.log("🚀 SSE URL:", url);

//       eventSource = new EventSource(url);

//       let lastProgress = 0;

//       eventSource.onmessage = (event) => {
//          try {
//             const data = JSON.parse(event.data);

//             console.log("📡 SSE DATA:", data);

//             // ================= 🔥 LIVE LOG =================
//             if (data.type === "progress") {

//                // 👉 UI STREAM (GFG STYLE)
//                const logLine = `✔ Passed: ${data.passed}/${data.total ?? totalTC}`;

//                setLiveLogs(prev => [...prev, logLine]);

//                // ================= PROGRESS =================
//                if (data.passed > lastProgress) {
//                   lastProgress = data.passed;

//                   setProgress(data.passed);
//                   setProgressTotal(data.total ?? totalTC);
//                }

//                return;
//             }

//             // ================= WRONG ANSWER =================
//             if (data.status === "Wrong Answer ❌") {

//                setLiveLogs(prev => [
//                   ...prev,
//                   `❌ Failed at Test Case ${data.failedCase?.index}`
//                ]);

//                setFailedCase(data.failedCase || null);
//                setSubmitResult(data);
//                setSubmitStatus("done");

//                setProgress(data.passed);

//                eventSource.close();
//                return;
//             }

//             // ================= RUNTIME ERROR =================
//             if (data.status === "Runtime Error ❌") {

//                setLiveLogs(prev => [...prev, "💥 Runtime Error"]);

//                setSubmitResult(data);
//                setSubmitStatus("done");

//                setProgress(data.passed || lastProgress);

//                eventSource.close();
//                return;
//             }

//             // ================= COMPILATION ERROR =================
//             if (data.status === "Compilation Error ❌") {

//                setLiveLogs(prev => [...prev, "⚠ Compilation Error"]);

//                setSubmitResult(data);
//                setSubmitStatus("done");

//                eventSource.close();
//                return;
//             }

//             // ================= ACCEPTED =================
//             if (data.status === "Accepted ✔") {

//                setLiveLogs(prev => [
//                   ...prev,
//                   "🎉 All Test Cases Passed!"
//                ]);

//                setSubmitResult(data);
//                setSubmitStatus("done");

//                setProgress(data.passed ?? lastProgress);

//                eventSource.close();
//                return;
//             }

//          } catch (e) {
//             console.log("❌ JSON parse error:", e);
//          }
//       };

//       eventSource.onerror = (err) => {
//          console.log("🔥 SSE Error:", err);

//          if (eventSource) eventSource.close();

//          setSubmitStatus("done");
//       };

//    } catch (err) {
//       console.log("🔥 Error:", err);
//       setSubmitStatus("done");
//    } finally {
//       setSubmitting(false);
//    }
// };

// export { handleSubmitCode };





 


 
   
   
  