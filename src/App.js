import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom"
import './App.css';
import { API, Storage } from 'aws-amplify';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { listLevels } from './graphql/queries';
import { createLevel as createLevelMutation, deleteLevel as deleteLevelMutation } from './graphql/mutations';
import { ExportCSV } from './ExportCSV';
import MakeHierarchy from './MakeHierarchy';


function App() {
  const levels = useState([]);

  return (
    <div className="App">
      <Link to="/">
      <h1>Magnolia Technologies Hierarchy Application</h1>
      </Link>
      <Link to="/makeHierarchy">
        <button>Create Level</button>
      </Link>
      <div style={{marginBottom: 30}}>
      {
        levels.map(level => (
          <div key={level.id || level.name}>
            <h2>{level.name}</h2>
            <p>{level.description}</p>
          </div>
        ))
      }
      </div>

      <AmplifySignOut />
    </div>
  );
}

export default withAuthenticator(App);
