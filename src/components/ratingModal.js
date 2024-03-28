import React, { useState } from 'react';
import TextArea from './textArea';
import { addRating } from '../backend';
import { firebaseDb } from '../firebase/firebase';
import { getDate } from '../utils';

export default function RatingModal({onClose, isModalVisible, isCustomer, targetUserUid }) {
  const [overallRating, setOverallRating] = useState(null);
  const [printQualityRating, setPrintQualityRating] = useState(null);
  const [communicationRating, setCommunicationRating] = useState(null);
  const [exchangeRating, setExchangeRating] = useState(null);
  const [canSubmit, setCanSubmit] = useState(false);
  const [comment, setComment] = useState('');

  const overallRatings = ['Good', 'Neutral', 'Bad'];
  const numberRatings = [1, 2, 3, 4, 5];

  // Only enable submit button if all ratings are selected
  React.useEffect(() => {
    setCanSubmit(
      (isCustomer && overallRating && printQualityRating && communicationRating && exchangeRating) ||
      (!isCustomer && overallRating && communicationRating && exchangeRating)
    );
  }, [overallRating, printQualityRating, communicationRating, exchangeRating]);

  const onSubmit = () => {
    const overallRatingNumber = getOverallRatingNumber();
    const date = getDate();
    let averageRating, rating;
    if (isCustomer) {
      averageRating = (overallRatingNumber + printQualityRating + communicationRating + exchangeRating) / 4;
      rating = {
        targetUserUid,
        averageRating,
        printQualityRating,
        communicationRating,
        exchangeRating,
        comment,
        date
      };
    } else {
      averageRating = (overallRatingNumber + communicationRating + exchangeRating) / 3;
      rating = {
        targetUserUid,
        averageRating,
        communicationRating,
        exchangeRating,
        comment,
        date
      };
    }
    addRating(firebaseDb, rating);
    onClose();
  }

  const getOverallRatingNumber = () => {
    switch(overallRating) {
      case 'Good':
        return 5;
      case 'Neutral':
        return 3;
      case 'Bad':
        return 1;
      default:
        return null;
    }
  }

  return (
    isModalVisible && (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-lg w-[600px] mx-auto">
          <p className="font-semibold text-2xl text-center">Rate your experience with Jasper for Boat.stl</p>
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
          {
            isCustomer && (
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
            )
          }
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
            <div className="text-2xl mb-5">Comment:</div>
            <TextArea value={comment} onChange={(e) => setComment(e.target.value)}/>
          </div>
          <button className={`float-right mt-4 p-2 px-4 rounded text-white ${canSubmit ? 'bg-brand-blue' : 'bg-gray-300'}`} onClick={() => onSubmit()} disabled={!canSubmit}>Submit</button>
        </div>
      </div>
    )
  );
}