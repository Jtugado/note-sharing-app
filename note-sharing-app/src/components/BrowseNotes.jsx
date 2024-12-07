import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BrowseNotes() {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredNotes(notes);
    } else {
      const lowercasedQuery = searchQuery.toLowerCase();
      const filtered = notes.filter((note) => {
        return (
          note.title.toLowerCase().includes(lowercasedQuery) ||
          note.course.toLowerCase().includes(lowercasedQuery) ||
          note.subject.toLowerCase().includes(lowercasedQuery) ||
          note.topic.toLowerCase().includes(lowercasedQuery)
        );
      });
      setFilteredNotes(filtered);
    }
  }, [searchQuery, notes]);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5001/api/notes', {
        timeout: 10000,
      });
      setNotes(response.data || []);
      setFilteredNotes(response.data || []);
      setError(null);
    } catch (error) {
      setError('Failed to fetch notes. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (noteId) => {
    try {
      const response = await axios.post(`http://localhost:5001/api/notes/${noteId}/like`);
      const updatedNote = response.data.note;
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === noteId ? updatedNote : note))
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleDislike = async (noteId) => {
    try {
      const response = await axios.post(`http://localhost:5001/api/notes/${noteId}/dislike`);
      const updatedNote = response.data.note;
      setNotes((prevNotes) =>
        prevNotes.map((note) => (note.id === noteId ? updatedNote : note))
      );
    } catch (error) {
      console.error('Error toggling dislike:', error);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await axios.delete(`http://localhost:5001/api/notes/${noteId}`);
      setNotes(notes.filter((note) => note.id !== noteId));
    } catch (error) {
      alert('Failed to delete note.');
    }
  };

  const handleDownload = (fileUrl) => {
    const fullUrl = `http://localhost:5001${fileUrl}`;
    window.open(fullUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <p className="text-red-500 text-2xl mb-4">{error}</p>
        <button onClick={fetchNotes} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Retry Fetching Notes
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Title */}
      <h1 className="text-4xl font-extrabold mb-6 text-center bg-gray-400 text-white py-3 rounded-lg shadow-md">
        Available Notes
      </h1>

      {/* Search Bar */}
      <div className="mb-6 flex justify-center">
        <input
          type="text"
          placeholder="Search by title, course, subject, or topic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-2/3 px-4 py-2 border rounded-md shadow focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      {filteredNotes.length === 0 ? (
        <div className="text-center text-gray-500">
          <p>No notes match your search.</p>
          <p className="mt-2 text-sm">Try adjusting your search query!</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-white shadow-md rounded-lg p-4 border border-gray-400 hover:shadow-lg transition-shadow"
            >
              <h2 className="text-xl font-bold mb-2 truncate bg-gray-200 p-2 rounded-md">
                <center>{note.title}</center>
              </h2>
              <div className="space-y-1 mb-4">
                <p>
                  <strong>Course:</strong> {note.course}
                </p>
                <p>
                  <strong>Subject:</strong> {note.subject}
                </p>
                <p>
                  <strong>Topic:</strong> {note.topic}
                </p>
                {note.uploadedAt && (
                  <p className="text-sm text-gray-500">
                    Uploaded: {new Date(note.uploadedAt).toLocaleString()}
                  </p>
                )}
              </div>
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => handleLike(note.id)}
                  className={`flex-1 py-2 px-4 rounded-lg ${
                    note.hasLiked
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-black hover:bg-green-500 hover:text-white'
                  }`}
                >
                  👍 {note.likes || 0}
                </button>
                <button
                  onClick={() => handleDislike(note.id)}
                  className={`flex-1 py-2 px-4 rounded-lg ${
                    note.hasDisliked
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-black hover:bg-red-500 hover:text-white'
                  }`}
                >
                  👎 {note.dislikes || 0}
                </button>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleDownload(note.fileUrl)}
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={() => handleDelete(note.id)}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BrowseNotes;
