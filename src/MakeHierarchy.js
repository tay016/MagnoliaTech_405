import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import './App.css';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listLevels } from './graphql/queries';
import { Dropdown } from "react-dropdown";
import { createLevel as createLevelMutation, deleteLevel as deleteLevelMutation } from './graphql/mutations';
import { ExportCSV } from './ExportCSV';

const initialFormState = { name: '', description: '', parentID: '' }

/*
options={levels.map(level => level.name)}
          onChange={e => setFormData({ ...formData, 'parentID': e.target.value})}
          placeholder="Level parent"
          value={formData.parentID}
*/

function MakeHierarchy() {
  const [levels, setLevels] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchLevels();
  }, []);

  async function fetchLevels() {
    const apiData = await API.graphql({ query: listLevels });
    const levelsFromAPI = apiData.data.listLevels.items;
    await Promise.all(levelsFromAPI.map(async level => {
      return level;
    }))
    setLevels(apiData.data.listLevels.items);
  }

  async function createLevel() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createLevelMutation, variables: { input: formData } });
    setLevels([ ...levels, formData ]);
    setFormData(initialFormState);
  }

  async function deleteLevel({ id }) {
    const newLevelsArray = levels.filter(level => level.id !== id);
    setLevels(newLevelsArray);
    await API.graphql({ query: deleteLevelMutation, variables: { input: { id } }});
  }
  
  async function onChange(e) {
    fetchLevels();
  }

  return (
    <div className="App" style={{marginBottom: 30}}>
      <h1>Magnolia Technologies Hierarchy Application</h1>
      <Link to="/">
        <button>View Hierarchy</button>
      </Link>
      
      <div style={{marginBottom: 30}}>
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

        <Dropdown
          
        />

        <button onClick={createLevel}>Create</button>
      </div>

      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(MakeHierarchy);