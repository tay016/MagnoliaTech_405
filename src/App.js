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
var optionIds = [];
var hierarchy = new HierarchyTree("Hierarchy");
var levelDropdown;

function App() {

  const [levels, setLevels] = useState([]);
  const [formData, setFormData] = useState(initialFormState);




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
    var idVal = Math.floor(Math.random() * 1000)
    formData['id'] = "ID" + idVal + formData.name;
    if (!formData.parentID) {
      formData.parentID = "ROOT";
    }
    console.log("PARENT:" + formData.parentID);
    await API.graphql({ query: createLevelMutation, variables: { input: formData } });
    setLevels([ ...levels, formData ]);
    updateParents();
    setFormData(initialFormState);
  }

  async function deleteLevel(id) {
    const newLevelsArray = levels.filter(level => level.id !== id);
    setLevels(newLevelsArray);
    await API.graphql({ query: deleteLevelMutation, variables: { input: { id } }});
    levels.forEach(level => {
      if (level.parentID == id) {
        deleteLevel(level.id);
      }
    })
  }

  function updateParents() {
    levelDropdown = document.getElementById('levelsDropdown');
    levelDropdown.options[0] = new Option("Root", 0);
    levels.forEach(level => {
      if (!optionIds.includes(level.id)) {
        levelDropdown.options[levelDropdown.options.length] = new Option(level.name, level.id)
        optionIds.push(level.id)
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
            setFormData({ ...formData, 'name': e.target.value});
            }
          }
          placeholder="Level name"
          value={formData.name}
        />
        <input style={{margin: 5}}
          onChange={e => {
            setFormData({ ...formData, 'description': e.target.value});
            }
          }
          placeholder="Level description"
          value={formData.description}
        />

        <select id='levelsDropdown' style={{margin: 5}} onChange={e => {
            setFormData({ ...formData, 'parentID': e.target.value});
            }
          }
          placeholder="Level parent"
          value={formData.parentID}>
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
            <p>Test: {level.id}</p>
            <p>Test: {level.parentID}</p>
            <button onClick={() => deleteLevel(level.id)}>Delete level</button>
          </div>
        ))
      }
      </div>

      <AmplifySignOut />
    </div>
  </div>
  )}

export default withAuthenticator(App);
