import React from 'react';

const Header = () => {
    const headerStyle = {
        backgroundColor: '#6090B8',
        color: 'white',
        padding: '20px 20px',
        fontSize: '35px',
        fontWeight: 'bold',
        marginBottom: '2px', // Adds black margin space around the header
        // can also do this w/o boxshadow and with border: '5px solid black',
        boxShadow: '0 0 0 2px gray', // Creates a black border-like margin effect
    };

    return (
        <div style={headerStyle}>
            What the Health Navigator  <i className="fa-solid fa-sliders"></i>
        </div>
    );
};

export default Header;
