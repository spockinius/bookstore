import React, { useState, useEffect } from 'react';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import AddBook from './AddBook';

import './App.css';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-material.css';

function App() {
  const [book, setbook] = useState([]);

  useEffect(() => {
    fetchItems();
  }, [])

  const fetchItems = () => {
    fetch('https://bookstore-d090f-default-rtdb.europe-west1.firebasedatabase.app/.json')
    .then(response => response.json())
    .then(data => addKeys(data))
    .catch(err => console.error(err))
  }

  // Add keys to the book objects
  const addKeys = (data) => {
    const keys = Object.keys(data);
    const valueKeys = Object.values(data).map((item, index) => 
    Object.defineProperty(item, 'id', {value: keys[index]}));
    setbook(valueKeys);
  }

  const addBook = (newBook) => {
     fetch('https://bookstore-d090f-default-rtdb.europe-west1.firebasedatabase.app/.json',
    {
      method: 'POST',
      body: JSON.stringify(newBook)
    })
    .then(response => fetchItems())
    .catch(err => console.error(err))
  }

  const deleteBook = (id) => {
    fetch(`https://bookstore-d090f-default-rtdb.europe-west1.firebasedatabase.app/${id}.json`,
   {
      method: 'DELETE',
    })
    .then(response => fetchItems())
    .catch(err => console.error(err))
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" noWrap> 
            Bookstore
          </Typography>
        </Toolbar>
      </AppBar> 
      <AddBook addBook={addBook} /> 
      <div className="ag-theme-material" style={ { height: 400, width: 1200, margin: 'auto' } }>
        <AgGridReact rowData={book}>
          <AgGridColumn sortable={true} filter={true} field='title' />
          <AgGridColumn sortable={true} filter={true} field='author' />
          <AgGridColumn sortable={true} filter={true} field='year' />
          <AgGridColumn sortable={true} filter={true} field='isbn' />
          <AgGridColumn sortable={true} filter={true} field='price' />
          <AgGridColumn 
            headerName=''
            field='id' 
            width={90}
            cellRendererFramework={ params => 
              <IconButton onClick={() => deleteBook(params.value)} size="small" color="secondary">
                <DeleteIcon />
              </IconButton>
            }
          />      
          </AgGridReact>
      </div>
    </div>
  );
}

export default App;