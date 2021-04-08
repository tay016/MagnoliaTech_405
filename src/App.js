import React, { useState, useEffect } from 'react';
import {Link} from "react-router-dom";
import './App.css';
import { withAuthenticator, AmplifySignOut } from '@aws-amplify/ui-react';
import { ExportCSV } from './ExportCSV';
import { levels, MakeHierarchy } from './MakeHierarchy';


function App() {

  return (
    <div className="App">
      <h1>Magnolia Technologies Hierarchy Application</h1>
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
