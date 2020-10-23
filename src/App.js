import React, { useState } from 'react';
import NewWindow from 'react-new-window';
import { AgGridReact } from 'ag-grid-react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';

const windowNameWithRequestAnimationFrame = 'gridWindow2';

const App = () => {
    const regions = { america: 'America', europe: 'Europe' };
    const cars = [
        { make: "Ford", model: "Fiesta", region: regions.america },
        { make: "Opel", model: "Corsa", region: regions.europe },
        { make: "Dodge", model: "Viper", region: regions.america },
        { make: "Fiat", model: "Ritmo", region: regions.europe },
        { make: "Chevrolet", model: "Camaro", region: regions.america },
        { make: "Seat", model: "Toledo", region: regions.europe },
    ];
    const [showGrid1, setShowGrid1] = useState(false);
    const [showGrid2, setShowGrid2] = useState(false);
    const [region, setRegion] = useState(regions.america);

    const getCarsInRegion = () => cars.filter(car => car.region === region);

    const registerOpenedWindow = (newWindow) => {
        window.parent[newWindow.name] = newWindow
    }

    return (
        <div className="ag-theme-alpine" style={{ height: 400, width: 600 }} center="screen">
            <button onClick={() => setShowGrid1(true)}>Show grids in new window (Some filter changes won't work if the main window is not active)</button>
            <button onClick={() => setShowGrid2(true)}>Show grids in new windows  (All filter changes will work if the main window is not active)</button>
            {
                showGrid1 &&
                <Grid
                    name="gridWindow1"
                    cars={getCarsInRegion()}
                    regions={regions}
                    onRegionChange={setRegion}
                    onWindowOpened={registerOpenedWindow}
                />
            }
            {
                showGrid2 &&
                <Grid
                    name={windowNameWithRequestAnimationFrame}
                    cars={getCarsInRegion()}
                    regions={regions}
                    onRegionChange={setRegion}
                    onWindowOpened={registerOpenedWindow}
                />
            }
        </div>
    );
};

const Grid = ({ name, cars, regions, onWindowOpened, onRegionChange }) => (
    <NewWindow name={name} features={{ width: 500, height: 500 }} onOpen={onWindowOpened}>
        <div>
            {
                Object.keys(regions).map(region => (
                    <button key={region} onClick={() => onRegionChange(regions[region])}>
                        Show cars from {region}
                    </button>
                ))
            }
        </div>
        <AgGridReact
            columnDefs={[
                { headerName: 'Make', field: 'make', cellRenderer: params => `${params.value}!` },
                { headerName: 'Model', field: 'model', valueFormatter: params => `${params.value}!` },
                { headerName: 'Price', field: 'region' }
            ]}
            rowData={cars}
        >
        </AgGridReact>
    </NewWindow>
)

function customRequestAnimationFrame(callback) {
    let callbackReceived = false;
    function receiveCallback(args) {
        if (!callbackReceived) {
            callback(args);
        }
        callbackReceived = true;
    }
    if (window[windowNameWithRequestAnimationFrame]) {
        window[windowNameWithRequestAnimationFrame].requestAnimationFrame(receiveCallback);
    }
    return mainWindowRequestAnimationFrame(receiveCallback);
}

const mainWindowRequestAnimationFrame = window.requestAnimationFrame;
window.requestAnimationFrame = customRequestAnimationFrame;

export default App;