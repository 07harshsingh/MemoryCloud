import { useState } from "react";
import api from "../config/api";
import { useNavigate } from "react-router-dom";

function CreateFolder(){
    const [name, setName] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault();
      try{
         const response = await api.post("/folder/", {name});
         alert(response.data.message);
         navigate("/dashboard")
      }catch(err){
         alert(err.response?.data?.message || "Failed to create folder")
      }
    }

    return(
        <div
            className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-8"
        >
            <form onSubmit={handleSubmit}
                className="w-full max-w-md bg-white p-5 sm:p-8 rounded-2xl shadow-xl"
            >
                <h1
                    className="text-2xl sm:text-3xl font-bold text-center text-blue-800 mb-8"
                >
                    Create Folder
                </h1>

                <label htmlFor=""
                    className="block text-sm font-medium text-gray-700 mb-2"
                >
                    Folder name :
                </label>

                <input value={name} onChange={(e) => setName(e.target.value)} type="text"
                    placeholder="Enter folder name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800"
                />

                <br />
                <br />

                <button type="submit"
                    className="w-full bg-blue-800 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
                >
                    Create Folder
                </button>

                <button type="button" onClick={() => navigate("/dashboard")}
                    className="w-full mt-3 border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                    Cancel
                </button>
            </form>
        </div>
    )
}

export default CreateFolder;