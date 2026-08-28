import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../config/api";

function Folder(){

    const {id} = useParams();

    const navigate = useNavigate();

    const [files, setFile] = useState([]);

    const [selectedFile, setSelectedFile] = useState([]);

    const [previewImage, setPreviewImage] = useState(null);

    const getFiles = async () => {
        try{
            const response = await api.get(`/file/folder/${id}`);
            setFile(response.data.data.files || []);
        }catch(err){
            alert(err.response?.data?.message || "Unable to get files");
        }
    }

    useEffect(() => {
        getFiles();
    },[id]);

    const handleOnChange = (e) => {
        setSelectedFile(Array.from(e.target.files));
    }

    const handleUpload = async () => {
        if(selectedFile.length === 0){
            return alert("Please select atleast one file to upload");
        }

        try{
            const formData = new FormData();

            selectedFile.forEach((file) => {
                formData.append("images", file);
            })

            const response = await api.post(`/file/upload/${id}`, formData);

            alert(response.data.message);

            setSelectedFile([]);

            getFiles();
        }catch(err){
            alert(err.response?.data?.message || "Unable to upload files");
        }
    }

    const handleDelete = async (file) => {

        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${file.originalName}"?`
        );

        if(!confirmDelete){
            return;
        }

        try{
            const response = await api.delete(`/file/${file._id}`);

            alert(response.data.message);

            getFiles();
        }catch(err){
            alert(err.response?.data?.message || "Unable to delete file");
        }
    }

    const handlePreview = (file) => {
        setPreviewImage(file);
    }

    const closePreview = () => {
        setPreviewImage(null);
    }

    return(
        <div className="min-h-screen bg-slate-100">

            <div className="bg-blue-800 shadow-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

                    <button
                        onClick={() => navigate("/dashboard")}
                        className="px-5 py-3 bg-white text-blue-800 font-semibold rounded-lg hover:bg-gray-100 transition"
                    >
                        ← Back
                    </button>

                    <h1 className="text-2xl sm:text-3xl font-bold text-white">
                        Folder
                    </h1>

                    <div className="w-20 sm:w-24"></div>

                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">

                    <h2 className="text-2xl font-bold text-gray-900 mb-5">
                        Upload Files
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4 items-center">

                        <input
                            type="file"
                            multiple
                            onChange={handleOnChange}
                            className="w-full h-12 text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer bg-white file:mr-4 file:h-12 file:px-5 file:border-0 file:bg-blue-700 file:text-white file:font-semibold hover:file:bg-blue-800"
                        />

                        <button
                            onClick={handleUpload}
                            className="h-12 px-6 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition whitespace-nowrap"
                        >
                            + Upload File
                        </button>

                    </div>

                </div>

                <div className="mt-8 bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200">

                    {files.length > 0 ? (

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

                            {files.map((file) => (

                                <div
                                    key={file._id}
                                    className="bg-gray-50 rounded-xl overflow-hidden border border-gray-200 hover:shadow-md transition"
                                >

                                    {file.resourceType === "image" ? (

                                        <div
                                            onClick={() => handlePreview(file)}
                                            className="cursor-pointer"
                                        >

                                            <img
                                                src={file.url}
                                                alt={file.originalName}
                                                className="w-full h-64 object-cover hover:opacity-90 transition"
                                            />

                                        </div>

                                    ) : (

                                        <div className="h-64 flex items-center justify-center p-4">

                                            <p className="text-gray-700 text-center break-all">
                                                {file.originalName}
                                            </p>

                                        </div>

                                    )}

                                    <div className="p-4">

                                        <p className="text-sm font-medium text-gray-800 truncate mb-3">
                                            {file.originalName}
                                        </p>

                                        <div className="flex gap-2">

                                            {file.resourceType === "image" && (

                                                <button
                                                    onClick={() => handlePreview(file)}
                                                    className="flex-1 px-3 py-2 bg-blue-700 text-white text-sm font-semibold rounded-lg hover:bg-blue-800 transition"
                                                >
                                                    Open
                                                </button>

                                            )}

                                            <button
                                                onClick={() => handleDelete(file)}
                                                className="flex-1 px-3 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition"
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    ) : (

                        <div className="py-16 text-center">

                            <div className="text-6xl mb-4">
                                📁
                            </div>

                            <h2 className="text-2xl font-bold text-gray-900">
                                No file found...
                            </h2>

                            <p className="text-gray-500 mt-2">
                                Upload some files to this folder.
                            </p>

                        </div>

                    )}

                </div>

            </div>

            {previewImage && (

                <div
                    onClick={closePreview}
                    className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
                >

                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="relative max-w-6xl max-h-[90vh] bg-white rounded-xl p-3 shadow-2xl"
                    >

                        <button
                            onClick={closePreview}
                            className="absolute -top-4 -right-4 w-10 h-10 bg-red-600 text-white rounded-full text-xl font-bold hover:bg-red-700 transition"
                        >
                            ×
                        </button>

                        <img
                            src={previewImage.url}
                            alt={previewImage.originalName}
                            className="max-w-full max-h-[85vh] object-contain rounded-lg"
                        />

                        <p className="text-center font-semibold text-gray-800 mt-3 px-2 truncate">
                            {previewImage.originalName}
                        </p>

                    </div>

                </div>

            )}

        </div>
    )
}

export default Folder;