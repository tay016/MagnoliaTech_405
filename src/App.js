import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import express from 'express';
import './App.css';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listLevels } from './graphql/queries';
import { createLevel as createLevelMutation, deleteLevel as deleteLevelMutation } from './graphql/mutations';
import { ExportCSV } from './ExportCSV';

const app = express();
app.set("view engine", "ejs");

const initialFormState = { name: '', description: '', parentID: '' };

function App() {

  const [levels, setLevels] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  const levelDropdown = document.getElementById('levelsDropdown')
  const layerMap = {
    0: 'h1',
    1: 'h2',
    2: 'h3',
    3: 'h4',
    4: 'h5',
    5: 'h6'
  }

  useEffect(() => {
    fetchLevels();
  }, []);

  async function fetchLevels() {
    const apiData = await API.graphql({ query: listLevels });
    const levelsFromAPI = apiData.data.listLevels.items;
    var select = document.getElementById("levelsDropdown");
    levelsFromAPI.forEach(i =>
      select.options[select.options.length] = new Option(levelsFromAPI[i], i));
    await Promise.all(levelsFromAPI.map(async level => {
      return level;
    }))
    setLevels(apiData.data.listLevels.items);
  }

  async function createLevel(layer) {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createLevelMutation, variables: { input: formData } });
    setLevels([ ...levels, formData ]);
    setFormData(initialFormState);
    
  }

  async function deleteLevel({ id }) {
    const newLevelsArray = levels.filter(level => level.id !== id);
    setLevels(newLevelsArray);
    await API.graphql({ query: deleteLevelMutation, variables: { input: { id } }});
    levelDropdown.options = levels.map(level => level.name);
  }
  
  async function onChange(e) {
    fetchLevels();
  }

  return (
    <div className="App" style={{marginBottom: 30}}>
      <h1>Magnolia Technologies Hierarchy Application</h1>
      
      <div style={{marginTop: 30}}>
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

        <select id='levelsDropdown'>
          onChange={e => setFormData({ ...formData, 'parentID': e.target.value})}
          placeholder="Level parent"
          value={formData.parentID}
        </select>
      
        <button onClick={createLevel(0)}>Create</button>
      </div>

      <div className="App">
      <div style={{marginBottom: 30}}>
      {
        levels.map(level => (
          <div key={level.id || level.name}>
            <% if level.layer == 0 { %>
              <h1>{level.name}</h1>
            <% } %>
            <% if level.layer == 1 { %>
              <h2>{level.name}</h2>
            <% } %>
            <% if level.layer == 2 { %>
              <h3>{level.name}</h3>
            <% } %>
            <% if level.layer == 3 { %>
              <h4>{level.name}</h4>
            <% } %>
            <% if level.layer == 4 { %>
              <h5>{level.name}</h5>
            <% } %>
            <% if level.layer == 5 { %>
              <h6>{level.name}</h6>
            <% } %>
            <button onClick={createLevel(++level.layer)}>Add</button>
            <p>{level.description}</p>
            <button onClick={() => deleteLevel(level)}>Delete level</button>
          </div>
        ))
      }
      </div>

      <AmplifySignOut />
    </div>
  </div>
  )}

export default withAuthenticator(App);
