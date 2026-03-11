import { useNavigate } from "react-router-dom";

function Home() {

   const navigate = useNavigate();

   return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>

          

         <button onClick={() => navigate("/java")}>
            Learn Java
         </button>

      </div>
   );
}

export default Home;