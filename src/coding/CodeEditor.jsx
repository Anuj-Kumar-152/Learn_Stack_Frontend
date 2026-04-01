import Editor from "@monaco-editor/react";
import { useRef, useEffect } from "react";

function CodeEditor({ code, setCode, language, problem }) {

   const editorRef = useRef(null);
   const editableRangeRef = useRef(null);
   const isUndoingRef = useRef(false);
   const braceCountRef = useRef({ open: 0, close: 0 });
   const isSettingValueRef = useRef(false);

   const getEditableRange = (value) => {
      const funcStart = value.indexOf(problem.functionName);
      const start = value.indexOf("{", funcStart) + 1;

      let count = 1;
      let i = start;

      while (i < value.length) {
         if (value[i] === "{") count++;
         if (value[i] === "}") count--;

         if (count === 0) break;
         i++;
      }

      return { start, end: i };
   };

   const countBraces = (value) => {
      let open = 0, close = 0;
      for (let ch of value) {
         if (ch === "{") open++;
         if (ch === "}") close++;
      }
      return { open, close };
   };

   const handleEditorDidMount = (editor) => {

      editorRef.current = editor;

      editor.updateOptions({
         autoClosingBrackets: "never",
         autoClosingQuotes: "never",
         autoSurround: "never",
         formatOnType: false,
         formatOnPaste: false,
         quickSuggestions: false,
         tabCompletion: "off"
      });

      const model = editor.getModel();
      const initialValue = model.getValue();

      editableRangeRef.current = getEditableRange(initialValue);
      braceCountRef.current = countBraces(initialValue);

      editor.onDidChangeModelContent((event) => {

         if (isUndoingRef.current || isSettingValueRef.current) return;

         const model = editor.getModel();
         const { start, end } = editableRangeRef.current;

         let isInvalid = false;

         for (let change of event.changes) {

            const changeStart = model.getOffsetAt(change.range.getStartPosition());

            // 🔥 FIX (only block before method)
            if (changeStart < start) {
               isInvalid = true;
               break;
            }
         }

         // 🔥 FIX (correct value source)
         const newValue = model.getValue();

         const newCount = countBraces(newValue);
         const oldCount = braceCountRef.current;

         if (
            newCount.open !== oldCount.open ||
            newCount.close !== oldCount.close
         ) {
            isInvalid = true;
         }

         if (isInvalid) {
            isUndoingRef.current = true;
            editor.trigger("keyboard", "undo", null);
            isUndoingRef.current = false;
            return;
         }

         setCode(newValue);
      });
   };

   useEffect(() => {
      if (editorRef.current && code) {

         isSettingValueRef.current = true;

         editorRef.current.setValue(code);

         editableRangeRef.current = getEditableRange(code);
         braceCountRef.current = countBraces(code);

         setTimeout(() => {
            isSettingValueRef.current = false;
         }, 0);
      }
   }, [problem]);

   return (
      <Editor
         key={problem.id}
         height="100%"
         language={language}
         defaultValue={code}
         onMount={handleEditorDidMount}
         theme="vs-dark"
         options={{
            fontSize: 14,
            minimap: { enabled: false },
            autoClosingBrackets: "never",
            autoClosingQuotes: "never",
            autoSurround: "never",
            formatOnType: false,
            formatOnPaste: false,
            quickSuggestions: false,
            tabCompletion: "off"
         }}
      />
   );
}

export default CodeEditor;



 
  