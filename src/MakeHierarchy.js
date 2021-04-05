import React, { useState, useEffect } from 'react';
import './App.css';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listLevels } from './graphql/queries';
import { createLevel as createLevelMutation, deleteLevel as deleteLevelMutation } from './graphql/mutations';
import { ExportCSV } from './ExportCSV';

const initialFormState = { name: '', description: '' }

function MakeHierarchy() {
  const [levels, setLevels] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchLevels();
  }, []);

  async function fetchLevels() {
    const apiData = await API.graphql({ query: listLevels });
    const notesFromAPI = apiData.data.listLevels.items;
    await Promise.all(levelsFromAPI.map(async level => {
      if (level.image) {
        const image = await Storage.get(level.image);
        level.image = image;
      }
      return level;
    }))
    setNotes(apiData.data.listLevels.items);
  }

  async function createLevel() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createLevelMutation, variables: { input: formData } });
    if (formData.image) {
      const image = await Storage.get(formData.image);
      formData.image = image;
    }
    setLevels([ ...levels, formData ]);
    setFormData(initialFormState);
  }

  async function deleteLevel({ id }) {
    const newLevelsArray = levels.filter(level => level.id !== id);
    setLevels(newLevelsArray);
    await API.graphql({ query: deleteLevelMutation, variables: { input: { id } }});
  }
  
  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchLevels();
  }

  return (
    <div className="App">
      <h1>Magnolia Technologies Hierarchy Application </h1>
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value})}
        placeholder="Level name"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value})}
        placeholder="Level description"
        value={formData.description}
      />

      <input
        onChange={e => setFormData({ ...formData, 'parentID': e.target.value})}
        placeholder="Level parent"
        value={formData.parentID}
      />
      
      <button onClick={createNote}>Create</button>
      <div style={{marginBottom: 30}}>
      </div>

      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(MakeHierarchy);