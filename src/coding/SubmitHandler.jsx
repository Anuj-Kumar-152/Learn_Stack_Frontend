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
      console.log("🚀 SUBMIT START");

      const user = JSON.parse(localStorage.getItem("user"));
      console.log("👤 USER:", user);

      if (!user?._id) {
         console.log("❌ USER ID NOT FOUND");
         return;
      }

      console.log("📤 Sending userId:", user._id);

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

      // 🔥 ONLY CHANGE: userId added
      const url = `${import.meta.env.VITE_BACKEND_URL}/api/submit?code=${encodedCode}&slug=${slug}&userId=${user._id}`;

      console.log("🌐 API URL:", url);

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
            console.log("❌ PARSE ERROR:", e);
         }
      };

      eventSource.onerror = () => {
         console.log("❌ SSE ERROR");
         if (eventSource) eventSource.close();
         setSubmitStatus("done");
      };

   } catch (err) {
      console.log("🔥 SUBMIT ERROR:", err);
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
//    setLiveLogs,
//    setIsStopped
// }) => {

//    let eventSource = null;

//    try {
//       setSubmitting(true);
//       setLeftView("run");

//       setRunOutput("");
//       setSubmitStatus("processing");
//       setSubmitResult(null);
//       setFailedCase(null);

//       setLiveLogs([]);
//       setIsStopped(false);

//       const totalTC = problem.testCases?.length || 0;

//       setProgress(0);
//       setProgressTotal(totalTC);

//       const encodedCode = encodeURIComponent(code.trim());

//       const url = `${import.meta.env.VITE_BACKEND_URL}/api/submit?code=${encodedCode}&slug=${slug}`;

//       eventSource = new EventSource(url);

//       let lastProgress = 0;

//       eventSource.onmessage = (event) => {
//          try {
//             const data = JSON.parse(event.data);

//             if (data.type === "progress") {
//                const logLine = `✔ Passed: ${data.passed}/${data.total ?? totalTC}`;
//                setLiveLogs(prev => [...prev, logLine]);

//                if (data.passed > lastProgress) {
//                   lastProgress = data.passed;
//                   setProgress(data.passed);
//                   setProgressTotal(data.total ?? totalTC);
//                }
//                return;
//             }

//             if (data.status === "Wrong Answer ❌") {
//                setIsStopped(true);

//                setLiveLogs(prev => [
//                   ...prev,
//                   `❌ Failed at Test Case ${data.failedCase?.index}`
//                ]);

//                setFailedCase(data.failedCase);
//                setSubmitResult(data);
//                setSubmitStatus("done");

//                setProgress(data.passed);

//                eventSource.close();
//                return;
//             }

//             if (data.status === "Accepted ✔") {
//                setIsStopped(true);

//                setLiveLogs(prev => [
//                   ...prev,
//                   "🎉 All Test Cases Passed!"
//                ]);

//                setSubmitResult(data);
//                setSubmitStatus("done");

//                setProgress(data.passed);

//                eventSource.close();
//                return;
//             }

//          } catch (e) {
//             console.log(e);
//          }
//       };

//       eventSource.onerror = () => {
//          if (eventSource) eventSource.close();
//          setSubmitStatus("done");
//       };

//    } catch (err) {
//       console.log(err);
//       setSubmitStatus("done");
//    } finally {
//       setSubmitting(false);
//    }
// };

// export { handleSubmitCode };



 
   
   
  