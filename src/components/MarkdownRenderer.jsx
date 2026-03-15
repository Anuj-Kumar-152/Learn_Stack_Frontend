import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { useState } from "react";

import ImageSlider from "./ImageSlider";
import CodeBlock from "./CodeBlock";

function MarkdownRenderer({ content }) {

   const [copiedCode, setCopiedCode] = useState("");
   const [outputs, setOutputs] = useState({});
   const [editedCodes, setEditedCodes] = useState({});
   const [hiddenOutputs, setHiddenOutputs] = useState({});

   const handleCopy = (code) => {

      navigator.clipboard.writeText(code);

      setCopiedCode(code);

      setTimeout(() => {
         setCopiedCode("");
      }, 2000);

   };

   const runCode = async (code, id) => {

      // edited code save
      setEditedCodes(prev => ({
         ...prev,
         [id]: code
      }));

      // show output
      setHiddenOutputs(prev => ({
         ...prev,
         [id]: false
      }));

      setOutputs(prev => ({
         ...prev,
         [id]: "Running..."
      }));

      try {

         const res = await fetch("VITE_BACKEND_URL/api/run", {
            method: "POST",
            headers: {
               "Content-Type": "application/json"
            },
            body: JSON.stringify({ code })
         });

         const data = await res.json();

         setOutputs(prev => ({
            ...prev,
            [id]: data.output || data.stderr || data.compile_output || "No Output"
         }));

      } catch {

         setOutputs(prev => ({
            ...prev,
            [id]: "Error running code"
         }));

      }

   };

   // OutputBox close hone par code reset
   const handleHideOutput = (id) => {

      setHiddenOutputs(prev => ({
         ...prev,
         [id]: true
      }));

      setEditedCodes(prev => {
         const newCodes = { ...prev };
         delete newCodes[id];
         return newCodes;
      });

   };

   return (

      <div className="max-w-full">

         <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}

            components={{

               code({ inline, className, children, node }) {

                  const match = /language-(\w+)/.exec(className || "");
                  const codeString = String(children).replace(/\n$/, "");

                  if (!inline && match) {

                     const id = node.position.start.line;
                     const currentCode = editedCodes[id] || codeString;

                     return (
                        <CodeBlock
                           key={id}
                           id={id}
                           language={match[1]}
                           code={currentCode}
                           copiedCode={copiedCode}
                           outputs={outputs}
                           hiddenOutputs={hiddenOutputs}
                           hideOutput={handleHideOutput}
                           onCopy={handleCopy}
                           onRun={runCode}
                        />
                     );

                  }

                  return (
                     <code className="bg-gray-100 px-1 py-0.5 rounded text-sm break-words">
                        {children}
                     </code>
                  );

               },

               slider({ children }) {

                  const images = children
                     .toString()
                     .trim()
                     .split("\n")
                     .map(img => `/images/${img.trim()}`);

                  return <ImageSlider images={images} />;

               },

               img({ src, alt }) {

                  return (
                     <img
                        src={src}
                        alt={alt}
                        className="w-full max-w-full h-auto rounded-lg my-6"
                     />
                  );

               }

            }}

         >
            {content}
         </ReactMarkdown>

      </div>

   );

}

export default MarkdownRenderer;


 





 