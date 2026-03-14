import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";

import ImageSlider from "./ImageSlider";

function MarkdownRenderer({ content }) {

   return (

      <div className="max-w-full">

         <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}

            components={{

               /* Code Highlighting */

               code({ inline, className, children }) {

                  const match = /language-(\w+)/.exec(className || "");

                  return !inline && match ? (

                     <div className="overflow-x-auto">

                        <SyntaxHighlighter
                           style={oneLight}
                           language={match[1]}
                           PreTag="div"
                           customStyle={{
                              background: "#ffffff",
                              borderRadius: "10px",
                              padding: "16px",
                              marginTop: "20px",
                              marginBottom: "20px",
                              fontSize: "14px"
                           }}
                        >

                           {String(children).replace(/\n$/, "")}

                        </SyntaxHighlighter>

                     </div>

                  ) : (

                     <code className="bg-gray-100 px-1 py-0.5 rounded text-sm break-words">
                        {children}
                     </code>

                  );

               },


               /* Image Slider */

               slider({ children }) {

                  const images = children
                     .toString()
                     .trim()
                     .split("\n")
                     .map(img => `/images/${img.trim()}`);

                  return <ImageSlider images={images} />;

               },


               /* Images Responsive */

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

   )

}

export default MarkdownRenderer;





 