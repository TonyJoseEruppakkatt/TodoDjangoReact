import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { saveAs } from 'file-saver';

const ExportDropdown = ({ todos }) => {
  const exportAsJSON = () => {
    const blob = new Blob([JSON.stringify(todos, null, 2)], {
      type: 'application/json',
    });
    saveAs(blob, 'todos.json');
  };

  const exportAsCSV = () => {
    const header = ['ID', 'Name', 'Due Date', 'Completed'];
    const rows = todos.map(todo =>
      [todo.id, todo.name, todo.due_date, todo.completed ? 'Yes' : 'No'].join(',')
    );
    const csv = [header.join(','), ...rows].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    saveAs(blob, 'todos.csv');
  };

  const exportAsText = () => {
    const text = todos
      .map(todo => `ID: ${todo.id}, Task: ${todo.name}, Due: ${todo.due_date}, Done: ${todo.completed}`)
      .join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    saveAs(blob, 'todos.txt');
  };

  const exportAsSQL = () => {
    const sql = todos
      .map(todo =>
        `INSERT INTO todos (id, name, due_date, completed) VALUES (${todo.id}, '${todo.name}', '${todo.due_date}', ${todo.completed});`
      )
      .join('\n');
    const blob = new Blob([sql], { type: 'text/sql' });
    saveAs(blob, 'todos.sql');
  };

  return (
    <Dropdown className="mb-3 mx-2">
      <Dropdown.Toggle variant="success" id="dropdown-export">
        Export
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item onClick={exportAsJSON}>Export as JSON</Dropdown.Item>
        <Dropdown.Item onClick={exportAsCSV}>Export as CSV</Dropdown.Item>
        <Dropdown.Item onClick={exportAsText}>Export as Text</Dropdown.Item>
        <Dropdown.Item onClick={exportAsSQL}>Export as SQL</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ExportDropdown;
