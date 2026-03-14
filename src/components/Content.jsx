import { useEffect, useState } from "react"; 
import MarkdownRenderer from "./MarkdownRenderer";
import ReadingProgress from "./ReadingProgress";
import CompletionMessage from "./CompletionMessage";
import Loader from "./Loader";

function Content({ slug }) {

   const [topic, setTopic] = useState(null);
   const [progress, setProgress] = useState(0);
   const [completed, setCompleted] = useState(false);

   useEffect(() => {

      if (!slug) return;

      setCompleted(false);
      setProgress(0);
      setTopic(null);

       
      const container = document.querySelector(".content-scroll");
      if (container) {
         container.scrollTop = 0;
         container.dispatchEvent(new Event("scroll"));
      } 
      
     fetch(`${import.meta.env.VITE_BACKEND_URL}/api/topics/${slug}`)
   .then(res => res.json())
   .then(data => {
      setCompleted(false);
      setProgress(0);
      setTopic(data);
   });

   }, [slug]);
 
   useEffect(() => {

      const container = document.querySelector(".content-scroll");

      if (!container || !topic) return;

      setCompleted(false);

      const handleScroll = () => {

         const scrollTop = container.scrollTop;
         const scrollHeight = container.scrollHeight;
         const clientHeight = container.clientHeight;

         const total = scrollHeight - clientHeight;

         if (total <= 0) return;
 
         const percent = Math.min(
            100,
            Math.round((scrollTop / total) * 100)
         );

         setProgress(percent);

         if (percent >= 99) {
            setCompleted(true);
         } else {
            setCompleted(false);
         }

      };

      container.addEventListener("scroll", handleScroll);

      return () => container.removeEventListener("scroll", handleScroll);

   }, [topic]);
    

   if (!topic) return <Loader />


   return (

       
      <div key={slug} className=" sm:px-6 lg:px-4 py-8 sm:py-10"> 
          
         <div key={topic._id} className="sticky max-w-3xl top-0 z-5 bg-white shadow-sm">

            <div className="sm:px-2 py-3 ml-3">

               <h1 className="text-2xl sm:text-md font-bold mb-3 font-merriweather">
                  {topic.title}
               </h1>

               <ReadingProgress progress={progress} />

               {completed && (
                  <CompletionMessage title={topic.title} />
               )}
                

            </div>

         </div>


         
         <div className="max-w-3xl mt-6 sm:mt-7">

            <article className="markdown-body">
               <MarkdownRenderer content={topic.content} />
            </article>

         </div> 
          

      </div>

   )

}

export default Content;




 