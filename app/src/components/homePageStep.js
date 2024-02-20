import React from 'react';

function HomePageStep({step, title, text}) {
    return (
        <div className="flex flex-col items-center mt-10">
        <div className="flex items-center justify-center w-24 h-24 bg-transparent border-4 border-blue-200 rounded-full">
          <span className="text-2xl font-bold">{step}</span>
        </div>
        <h2 className="mt-4 text-xl font-bold">{title}</h2>
        <div className="mt-2 text-center">
          {text.map((element, index) => (
            <React.Fragment key={index}>{element}</React.Fragment>
          ))}
        </div>
      </div>
    )
}

export default HomePageStep;

