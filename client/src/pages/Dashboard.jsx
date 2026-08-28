import { useEffect, useState } from "react";
import api from "../config/api";
import { useNavigate } from "react-router-dom";

function Dashboard(){

    const navigate = useNavigate();

    const [folders, setFolders] = useState([])
    
    const getFolders = async () => {
        try{
           const response = await api.get("/folder/");
           setFolders(response.data.data.folder);
        }catch(err){
           alert(err.response?.data?.message);
        }
    }

    useEffect(() => {
        getFolders();
    },[]);

    const handleLogout = () => {
        const logout = window.confirm("Are you sure you want to logout?");
        if(!logout){
            return;
        }
        localStorage.removeItem("token");
        navigate("/login");
    }

    const handleEdit = async (folder) => {
        const newName = window.prompt("Enter new folder name : ", folder.name);

        if(newName === null){
            return;
        }

        if(newName.trim() === ""){
            alert("Folder name can't be empty");
            return;
        }

        try{
            const response = await api.put(`/folder/${folder._id}`, {name : newName});
            alert(response.data.message);
            getFolders();
        }catch(err){
            alert(err.response?.data?.message || "Rename failed")
        }
    }

    const handleDelete = async (folder) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete "${folder.name}" folder?`);

        if(!confirmDelete){
            return;
        }

        try{
            const response = await api.delete(`/folder/${folder._id}`);
            alert(response.data.message);
            getFolders();
        }catch(err){
            alert(err.response?.data?.message || "Failed to delete folder")
        }
    }

    return(
        <div
            className="min-h-screen bg-slate-100"
        >
            <div
                className="bg-blue-800 text-white px-4 sm:px-8 py-5 shadow-md"
            >
                <div
                    className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
                >
                    <h1
                        className="text-2xl sm:text-3xl font-bold"
                    >
                        Memory Cloud
                    </h1>
                    <button onClick={handleLogout}
                        className="w-full sm:w-auto bg-white text-blue-800 px-5 py-2 rounded-lg font-semibold hover:bg-blue-50 transition"
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div
                className="max-w-6xl mx-auto px-4 sm:px-6 py-8"
            >
                <div
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
                >
                    <div>
                        <h2
                            className="text-2xl sm:text-3xl font-bold text-gray-800"
                        >
                            My Folders
                        </h2>
                        <p
                            className="text-gray-500 mt-1"
                        >
                            Organize your memories into folders
                        </p>
                    </div>
                    <button onClick={() => navigate("/create-folder")}
                        className="w-full sm:w-auto bg-blue-800 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-900 transition shadow-sm"
                    >
                        + Create Folder
                    </button>
                </div>

                {folders.length > 0 ? (
                    <div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
                    >
                        {folders.map((folder) => (
                            <div key={folder._id}
                                className="bg-white rounded-xl p-5 shadow-sm border border-gray-200 hover:shadow-lg hover:-translate-y-1 transition"
                            >
                                <div
                                    className="flex items-start justify-between gap-3"
                                >
                                    <div
                                        onClick={() => navigate(`/folder/${folder._id}`)}
                                        className="flex-1 cursor-pointer"
                                    >
                                        <div
                                            className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4"
                                        >
                                            <span
                                                className="text-2xl"
                                            >
                                                📁
                                            </span>
                                        </div>
                                        <h3
                                            className="text-lg font-bold text-gray-800 wrap-break-word"
                                        >
                                            {folder.name}
                                        </h3>
                                    </div>
                                </div>

                                <div
                                    className="flex gap-2 mt-5"
                                >
                                    <button onClick={() => handleEdit(folder)}
                                        className="flex-1 border border-blue-800 text-blue-800 py-2 rounded-lg font-medium hover:bg-blue-50 transition"
                                    >
                                        Rename
                                    </button>
                                    <button onClick={() => handleDelete(folder)}
                                        className="flex-1 border border-red-500 text-red-500 py-2 rounded-lg font-medium hover:bg-red-50 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div
                        className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 sm:p-12 text-center"
                    >
                        <div
                            className="text-5xl mb-4"
                        >
                            📁
                        </div>
                        <h2
                            className="text-xl sm:text-2xl font-bold text-gray-800"
                        >
                            No folder created yet
                        </h2>
                        <p
                            className="text-gray-500 mt-2 mb-6"
                        >
                            Create your first folder to start storing your memories.
                        </p>
                        <button onClick={() => navigate("/create-folder")}
                            className="bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
                        >
                            + Create Folder
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Dashboard;
