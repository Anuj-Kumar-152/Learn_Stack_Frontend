import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

import CodeButtons from "./CodeButtons";
import OutputBox from "./OutputBox";

function CodeBlock({
   id,
   language,
   code,
   copiedCode,
   outputs,
   hiddenOutputs,
   hideOutput,
   onCopy,
   onRun
}) {

   const [isEditing, setIsEditing] = useState(false);
   const [editableCode, setEditableCode] = useState(code);

   return (

      <div className="bg-gray-100 rounded-lg ">

         <div className="relative">

            <CodeButtons
               code={editableCode}
               copiedCode={copiedCode}
               onCopy={onCopy}
               onRun={() => onRun(editableCode, id)}
               isEditing={isEditing}
               setIsEditing={setIsEditing}
            />

            {isEditing ? (

               <textarea
                  value={editableCode}
                  onChange={(e) => setEditableCode(e.target.value)}
                  className="w-full font-mono text-sm p-4 border rounded bg-white"
                  rows={10}
               />

            ) : (

               <SyntaxHighlighter
                  style={oneLight}
                  language={language}
                  PreTag="div"
                  customStyle={{
                     background: "transparent",
                     padding: "16px",
                     margin: 0,
                     fontSize: "14px"
                  }}
               >
                  {editableCode}
               </SyntaxHighlighter>

            )}

            {outputs[id] && !hiddenOutputs[id] && (
               <OutputBox
                  output={outputs[id]}
                  onClose={() => hideOutput(id)}
               />
            )}

         </div>

      </div>

   );

}

export default CodeBlock;





 


 