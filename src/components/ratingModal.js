import React, { useState } from 'react';

export default function RatingModal({ submitRating, isModalVisible }) {
  const [overallRating, setOverallRating] = useState(null);
  const [printQualityRating, setPrintQualityRating] = useState(null);
  const [communicationRating, setCommunicationRating] = useState(null);
  const [exchangeRating, setExchangeRating] = useState(null);

  const overallRatings = ['Good', 'Neutral', 'Bad'];
  const numberRatings = [1, 2, 3, 4, 5];

  return (
    isModalVisible && (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg w-[600px] mx-auto">
          <p className="font-semibold text-2xl text-center">Rate your experience with Jasper for Boat.stlffffffffffffffffffffffffffffffffffffffffffffff</p>
          <hr className="border w-4/5 mx-auto my-4" />
          <div className="flex items-center">
            <p className="text-2xl mr-4">Overall:</p>
            {overallRatings.map((rating) => (
              <p
                key={rating}
                className={`text-2xl mr-5 cursor-pointer border-2 px-2 rounded ${overallRating === rating ? 'border-blue-500' : 'border-transparent'}`}
                onClick={() => setOverallRating(rating)}
              >
                {rating}
              </p>
            ))}
          </div>
          <div className="flex items-center mt-10">
            <div className="w-1/3 text-2xl">Print Quality:</div>
            <div className="w-2/3 flex">
              {numberRatings.map((rating) => (
                <p
                  key={rating}
                  className={`text-2xl mr-5 cursor-pointer border-2 px-2 rounded ${printQualityRating === rating ? 'border-blue-500' : 'border-transparent'}`}
                  onClick={() => setPrintQualityRating(rating)}
                >
                  {rating}
                </p>
              ))}
            </div>
          </div>
          <div className="flex items-center mt-10">
            <div className="w-1/3 text-2xl">Communication:</div>
            <div className="w-2/3 flex">
              {numberRatings.map((rating) => (
                <p
                  key={rating}
                  className={`text-2xl mr-5 cursor-pointer border-2 px-2 rounded ${communicationRating === rating ? 'border-blue-500' : 'border-transparent'}`}
                  onClick={() => setCommunicationRating(rating)}
                >
                  {rating}
                </p>
              ))}
            </div>
          </div>
          <div className="flex items-center mt-10">
            <div className="w-1/3 text-2xl">Exchange:</div>
            <div className="w-2/3 flex">
              {numberRatings.map((rating) => (
                <p
                  key={rating}
                  className={`text-2xl mr-5 cursor-pointer border-2 px-2 rounded ${exchangeRating === rating ? 'border-blue-500' : 'border-transparent'}`}
                  onClick={() => setExchangeRating(rating)}
                >
                  {rating}
                </p>
              ))}
            </div>
          </div>
          <div className="mt-10">
            <div className="text-2xl">Comment:</div>

            <textarea
              class="mt-5 px-2 py-1 bg-gray-50 border border-gray-300 text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500 block"
              rows="4"
              cols="50"
            />
          </div>
          <button className="float-right mt-4 bg-brand-blue text-white p-2 px-4 rounded" onClick={submitRating}>Submit</button>
        </div>
      </div>
    )
  );
}