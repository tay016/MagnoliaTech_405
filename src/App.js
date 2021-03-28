import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom"
import './App.css';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listNotes } from './graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from './graphql/mutations';
import { ExportCSV } from './ExportCSV';
import MakeHierarchy from './MakeHierarchy';

const initialFormState = { name: '', description: '' }

function App() {
  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData = await API.graphql({ query: listNotes });
    const notesFromAPI = apiData.data.listNotes.items;
    await Promise.all(notesFromAPI.map(async note => {
      if (note.image) {
        const image = await Storage.get(note.image);
        note.image = image;
      }
      return note;
    }))
    setNotes(apiData.data.listNotes.items);
  }

  return (
    <div className="App">
      <h1>Magnolia Technologies Hierarchy Application </h1>
      <Link to="/makeHierarchy">
        <button>Create Note</button>
      </Link>
      <div style={{marginBottom: 30}}>
      {
        notes.map(note => (
          <div key={note.id || note.name}>
            <h2>{note.name}</h2>
            <p>{note.description}</p>
            {
              note.image && <img src={note.image} style={{width: 400}} alt="Error"/>
            }
          </div>
        ))
      }
      </div>

      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
