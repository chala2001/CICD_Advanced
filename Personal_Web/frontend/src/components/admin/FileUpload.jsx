import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, CheckCircle, AlertCircle, X, File as FileIcon } from 'lucide-react';

const FileUpload = ({ label, currentFileUrl, onUploadSuccess, accept = "image/*" }) => {
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const inputRef = useRef(null);

    // Get the auth token to pass with the upload request
    const token = localStorage.getItem('adminToken');

    const handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUpload(e.dataTransfer.files[0]);
        }
    };

    const handleChange = function (e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleUpload(e.target.files[0]);
        }
    };

    const handleUpload = async (file) => {
        setError(null);
        setUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });

            // The backend returns { message: '...', fileUrl: '/uploads/xxx.jpg' }
            onUploadSuccess(response.data.fileUrl);
            setUploading(false);
        } catch (err) {
            console.error('Upload Error:', err);
            setError('Failed to upload file. Please try again.');
            setUploading(false);
        }
    };

    // Helper to determine if the currently saved URL is an image or PDF
    const isImage = currentFileUrl && currentFileUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i);

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>

            {/* Current File Preview */}
            {currentFileUrl && (
                <div className="mb-4 p-4 bg-gray-900 rounded-lg flex items-center justify-between border border-gray-700">
                    <div className="flex items-center space-x-4">
                        {isImage ? (
                            <img src={`http://localhost:5000${currentFileUrl}`} alt="Preview" className="h-16 w-16 object-cover rounded shadow-md border border-gray-700" />
                        ) : (
                            <div className="h-16 w-16 bg-gray-800 rounded flex items-center justify-center border border-gray-700">
                                <FileIcon className="text-google-blue-500 w-8 h-8" />
                            </div>
                        )}
                        <div>
                            <p className="text-sm font-medium text-gray-200">Current File</p>
                            <p className="text-xs text-gray-500 truncate max-w-xs">{currentFileUrl}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Drag & Drop Zone */}
            <div 
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ease-in-out
                    ${dragActive ? "border-google-blue-500 bg-google-blue-500/10" : "border-gray-700 bg-gray-800/30 hover:bg-gray-800/60"}
                    ${uploading ? "opacity-50 pointer-events-none" : ""}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    accept={accept}
                    onChange={handleChange}
                />
                
                <div className="flex flex-col items-center justify-center space-y-3">
                    {uploading ? (
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-google-blue-500"></div>
                    ) : (
                        <UploadCloud className={`w-12 h-12 ${dragActive ? "text-google-blue-400" : "text-gray-500"}`} />
                    )}
                    
                    <div className="text-base text-gray-300">
                        {uploading ? (
                            <span className="font-medium text-google-blue-400">Uploading file...</span>
                        ) : (
                            <p>
                                <span className="font-semibold text-google-blue-400 cursor-pointer">Click to upload</span> or drag and drop
                            </p>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 border border-gray-700 rounded-md px-2 py-1 bg-gray-900/50">
                        Accepts {accept === "image/*" ? "Images (JPG, PNG)" : "Documents (PDF, DOCX)"}
                    </p>
                </div>

                {error && (
                    <div className="mt-4 flex items-center justify-center space-x-2 text-sm text-red-400 bg-red-400/10 py-2 rounded-lg">
                        <AlertCircle className="w-4 h-4" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
