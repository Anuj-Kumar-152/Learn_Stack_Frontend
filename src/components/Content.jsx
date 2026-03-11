import { useEffect, useState } from "react";

function Content({ slug }) {

   const [topic, setTopic] = useState(null);

   useEffect(() => {

      if (!slug) return;

      fetch(`http://localhost:9000/api/topics/${slug}`)
         .then(res => res.json())
         .then(data => setTopic(data));

   }, [slug]);

   if (!topic) return <div>Select a topic</div>

   return (

      <div style={{ padding: "20px" }}>

         <h1>{topic.title}</h1>

         <p>{topic.content}</p>

      </div>

   )
}

export default Content;