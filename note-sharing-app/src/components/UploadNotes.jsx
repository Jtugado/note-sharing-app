import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function UploadNotes() {
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    subject: '',
    topic: '',
  });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
    if (selectedFiles.length > 0 && !formData.title) {
      setFormData((prev) => ({ ...prev, title: selectedFiles[0].name }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form fields
    if (!formData.course || !formData.subject || !formData.topic) {
      setMessage('Please fill in all required fields');
      return;
    }

    if (files.length === 0) {
      setMessage('Please select at least one file');
      return;
    }

    setUploading(true);
    setMessage(null);

    const uploadFormData = new FormData();
    uploadFormData.append('course', formData.course);
    uploadFormData.append('subject', formData.subject);
    uploadFormData.append('topic', formData.topic);
    uploadFormData.append('title', formData.title || files[0].name);
    
    files.forEach((file) => {
      uploadFormData.append('files', file);
    });

    try {
      const response = await axios.post('http://localhost:5001/api/notes', uploadFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000, // 30 second timeout
      });
      
      setMessage('Notes uploaded successfully!');
      setTimeout(() => navigate('/browse'), 2000);
    } catch (error) {
      console.error('Upload Error:', error);
      
      // More detailed error handling
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        const errorMessage = error.response.data.error || 
                             'Server responded with an error';
        setMessage(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        setMessage('No response received from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setMessage('An unexpected error occurred. Please try again.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Upload your notes</h1>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {message && (
            <div
              className={`px-4 py-3 rounded mb-6 ${
                message.includes('successfully') 
                  ? 'bg-green-100 border-green-400 text-green-700' 
                  : 'bg-red-100 border-red-400 text-red-700'
              }`}
            >
              {message}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="w-full p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-center justify-between">
                <label className="px-4 py-2 bg-white rounded border cursor-pointer hover:bg-gray-50">
                  Choose File
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
                  />
                </label>
                <span className="text-gray-500">
                  {files.map((file) => file.name).join(', ') || 'No files selected'}
                </span>
              </div>
            </div>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="text"
              name="course"
              value={formData.course}
              onChange={handleInputChange}
              placeholder="Course"
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Subject"
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="text"
              name="topic"
              value={formData.topic}
              onChange={handleInputChange}
              placeholder="Topic"
              className="w-full p-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <button
              type="submit"
              disabled={uploading}
              className="w-full p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UploadNotes;