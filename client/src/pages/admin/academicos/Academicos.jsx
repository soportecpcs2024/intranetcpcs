import Layout from "../../../components/Layout";


const Academicos = () => {
  return (
    <div>
      <h2>Académicos</h2>;
       
      <button
          onClick={async () => {
            const res = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/api/usuarios`
            );
            const data = await res.json();
            console.log(data);
          }}
        >
          Users
        </button>
        <button
          onClick={async () => {
            const res = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/api/student_notes`
            );
            const data = await res.json();
            console.log(data);
          }}
        >
          students
        </button>
    </div>
  )
}

export default Academicos
