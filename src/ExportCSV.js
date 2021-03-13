import React from 'react'
import { CSVLink } from 'react-csv'
import Button from 'react-bootstrap/Button';

export const ExportCSV = ({csvData, fileName}) => {
    return (
        <Button variant="warning">
            <CSVLink data={csvData} filename={fileName}>Export</CSVLink>
        </Button>
    )
}