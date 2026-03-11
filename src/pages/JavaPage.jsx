import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Content from "../components/Content";

function JavaPage() {

   const [slug, setSlug] = useState("");

   return (

      <div style={{ display: "flex" }}>

         <Sidebar setSlug={setSlug} />

         <Content slug={slug} />

      </div>

   )
}

export default JavaPage;