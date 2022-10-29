import React, { Component } from 'react';
import Line from "../../../../savras/src/components/charts/line";

function App() {
    return (
        <div className="App">
            <div className="container">
                <h1>Build React Graphs The Easy Way</h1>
                {/* other graphs */}
                <div className="section">
                    <Line />
                </div>
            </div>
        </div>
    );
}

export default App;
