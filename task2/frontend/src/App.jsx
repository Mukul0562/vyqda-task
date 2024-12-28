import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [paragraph, setParagraph] = useState("");

  useEffect(() => {
    axios.get("http://localhost:5000/notes").then((response) => {
      setNotes(response.data);
    });
  }, []);

  const handleAddNote = async () => {
    if (title && paragraph) {
      const newNote = {
        title,
        paragraph,
        timestamp: new Date().toLocaleString(),
      };

      try {
        const response = await axios.post(
          "http://localhost:5000/notes",
          newNote
        );
        setNotes([...notes, response.data]);
        setTitle("");
        setParagraph("");
        setShowForm(false);
      } catch (error) {
        console.error("Error saving note:", error);
      }
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/notes/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="min-h-screen bg-teal-200 flex flex-col items-center">
      <header className="bg-black text-white py-4 w-full flex justify-start items-center px-6">
        <h1 className="text-3xl font-bold">Notes</h1>
      </header>

      <div className="mt-10 w-full max-w-5xl px-4">
        <div
          className="cursor-pointer bg-white p-4 rounded-lg shadow-lg text-gray-600 text-center"
          onClick={() => setShowForm(true)}
        >
          Take a note...
        </div>

        {showForm && (
          <div className="bg-white p-6 mt-4 rounded-lg shadow-lg">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-300"
            />
            <textarea
              placeholder="Paragraph"
              value={paragraph}
              onChange={(e) => setParagraph(e.target.value)}
              className="w-full mb-4 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-green-300"
            />
            <button
              onClick={handleAddNote}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
            >
              Save
            </button>
          </div>
        )}

        <div className="mt-6 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-between relative"
            >
              <div>
                <h2 className="text-xl font-bold mb-2 break-words">
                  {note.title}
                </h2>
                <p className="text-gray-600 break-words">{note.paragraph}</p>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <span className="text-sm text-gray-400">{note.timestamp}</span>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
