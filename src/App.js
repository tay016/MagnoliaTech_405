import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import './App.css';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listLevels } from './graphql/queries';
import { createLevel as createLevelMutation, deleteLevel as deleteLevelMutation } from './graphql/mutations';
import { HierarchyLevel, HierarchyTree } from './HierarchyTree';
import { ExportCSV } from './ExportCSV';

const initialFormState = { name: '', description: '', parentID: '' };

function App() {

  const [levels, setLevels] = useState([]);
  const [formData, setFormData] = useState(initialFormState);
  
  var hierarchy = new HierarchyTree("Hierarchy");
  var levelDropdown;



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

  function updateParents() {
    console.log("update called");
    levelDropdown = document.getElementById('levelsDropdown');
    levelDropdown.options[0] = new Option("Root", 0);
    var optionIds = []
    Array.prototype.forEach.call(levelDropdown.options ,option => optionIds.push(option.value))
    console.log(optionIds);
    levels.forEach(level => {
      console.log("levels for each");
      if (!optionIds.includes(level.id)) {
        console.log("adding");
        levelDropdown.options[levelDropdown.options.length] = new Option(level.name, level.id)
      }
      console.log(levelDropdown.options);
    })
  }
  
  async function onChange(e) {
    fetchLevels();
  }

  return (
    <div className="App" style={{marginBottom: 30}}>
      <h1>Magnolia Technologies Hierarchy Application</h1>
      <div style={{marginTop: 30}}>
        <input style={{margin: 5}}
          onChange={e => {
            setFormData({ ...formData, 'name': e.target.value})
            updateParents();
            }
          }
          placeholder="Level name"
          value={formData.name}
        />
        <input style={{margin: 5}}
          onChange={e => setFormData({ ...formData, 'description': e.target.value})}
          placeholder="Level description"
          value={formData.description}
        />

        <select id='levelsDropdown' style={{margin: 5}}>
          onChange={e => {
            setFormData({ ...formData, 'parentID': e.target.value});
            updateParents();
            }
          }
          placeholder="Level parent"
          value={formData.parentID}
          <option value= "0">Root</option>
        </select>
      
        <button onClick={createLevel}>Create</button>
      </div>

      <div className="App">
      <div style={{marginBottom: 30}}>
      {
        levels.map(level => (
          <div key={level.id || level.name}>
            <h2>{level.name}</h2>
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
