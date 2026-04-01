const handleRunCode = async ({
   code,
   input,
   slug,
   problem, // 🔥 ADD THIS
   setRunning,
   setLeftView,
   setSubmitStatus,
   setSubmitResult,
   setFailedCase,
   setRunOutput,
   setRunResult
}) => {
   try {
      setRunning(true);
      setLeftView("run");

      setSubmitStatus("idle");
      setSubmitResult(null);
      setFailedCase(null);

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/run`, {
         method: "POST",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ code, input, slug })
      });

      const data = await res.json();

      console.log("🧪 RUN RESPONSE:", data);

      // 🔥 FIX: expected add karo
      const expectedOutput = problem?.examples?.[0]?.output || "";

      setRunResult({
         input,
         output: data.output || data.error || "No Output",
         expected: expectedOutput
      });

      setRunOutput(data.output || data.error || "No Output");

   } catch (err) {
      console.log("🔥 RUN ERROR:", err);

      const expectedOutput = problem?.examples?.[0]?.output || "";

      setRunResult({
         input,
         output: "Error running code",
         expected: expectedOutput
      });

      setRunOutput("Error running code");
   } finally {
      setRunning(false);
   }
};

export { handleRunCode };









// const handleRunCode = async ({
//    code,
//    input,
//    slug,
//    setRunning,
//    setLeftView,
//    setSubmitStatus,
//    setSubmitResult,
//    setFailedCase,
//    setRunOutput,

//    // 🔥 ADD THIS
//    setRunResult
// }) => {
//    try {
//       setRunning(true);
//       setLeftView("run");

//       setSubmitStatus("idle");
//       setSubmitResult(null);
//       setFailedCase(null);

//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/run`, {
//          method: "POST",
//          headers: { "Content-Type": "application/json" },
//          body: JSON.stringify({ code, input, slug })
//       });

//       const data = await res.json();

//       console.log("🧪 RUN RESPONSE:", data);

//       // 🔥 IMPORTANT FIX
//       setRunResult(data);

//       setRunOutput(data.output || "No Output");

//    } catch (err) {
//       console.log("🔥 RUN ERROR:", err);
//       setRunOutput("Error running code");
//    } finally {
//       setRunning(false);
//    }
// };

// export { handleRunCode };




 
 