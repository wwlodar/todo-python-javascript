import React from 'react';

function MyButton() {
  function handleClick() {
    alert('You clicked me!');
  }

  return (
    <button onClick={handleClick}>
      Click me
    </button>
  );
}


function Home() {
    return (
      <div>
        <h1>this is the homepage</h1>
        <a>
        <MyButton />
        </a>
      </div>
    );
}

export default Home;