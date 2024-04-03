import JobCard, { BidJobCard } from "../components/jobCard";
import React, { useState, useEffect } from 'react';
import { firebaseDb } from '../firebase/firebase';
import { collection, onSnapshot, or, and, query, where } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";
import { getThumbnail } from "../backend";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css';
import RatingModal from "../components/ratingModal";
import { doc, getDoc, updateDoc} from "firebase/firestore"

export default function Orders({ isPrinter = false }) {
  const [listedOrders, setListedOrders] = useState([]);
  const [acceptedOrders, setAcceptedOrders] = useState([]);
  const [completeOrders, setCompleteOrders] = useState([]);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const navigate = useNavigate();
  const userContext = useAuth();
  const uid = userContext.currUser.uid;
  const [dataLoading, setDataLoading] = useState(true);
  const [jobName, setJobName] = useState(null);
  const [printerUid, setPrinterUid] = useState(null);

  useEffect(() => {
    setDataLoading(true);

    const jobRef = collection(firebaseDb, 'Jobs');
    const jobQuery = (isPrinter) ?
      query(jobRef, or(
        where("PrinterUid", "==", uid),
        and(
          where("PrinterUid", "==", null),
          where("BidderUid", "array-contains", uid)))) :
      query(jobRef, where("CustomerUid", "==", uid));

    const unsubscribe = onSnapshot(jobQuery, async (snapshot) => {
      try {
        const fetchedListed = [];
        const fetchedAccepted = [];
        const fetchedComplete = [];

        await Promise.all(snapshot.docs.map(async (doc) => {
          const data = doc.data();
          let thumbnail = null;

          try {
            thumbnail = await getThumbnail(doc.id);
          } catch (error) {
            console.error("Error fetching thumbnail: ", error)
            thumbnail = null;
          }

          const acceptedBid = (data.AcceptedBid !== undefined) ? data.AcceptedBid : true;
          const completeOrder = (data.Complete !== undefined) ? data.Complete : true;

          const order = {
            thumbnail: thumbnail,
            id: doc.id,
            quantity: data.Quantity,
            infill: data.Infill,
            material: data.Material,
            distance: data.Radius,
            fileName: data.FileName,
            color: data.Color,
            jobName: data.JobName,
            hasLeftReview: data.HasLeftReview,
            printerUid: data.PrinterUid,
          };

          if (completeOrder && order.hasLeftReview) {
            fetchedComplete.push(order)
          } else if (acceptedBid) {
            fetchedAccepted.push(order)
          } else {
            fetchedListed.push(order)
          }
        }));

        setListedOrders(fetchedListed)
        setAcceptedOrders(fetchedAccepted);
        setCompleteOrders(fetchedComplete);
        setDataLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    })

    return () => {
      unsubscribe();
    };
  }, [isPrinter, uid]);

  const onRatingLinkClicked = (job) => {
    setJobName(job.jobName);
    setPrinterUid(job.printerUid);
    setShowRatingModal(true);
    const docRef = doc(firebaseDb, `Jobs/${job.id}`);
    updateDoc(docRef, { HasLeftReview: true })
    setAcceptedOrders(prevOrders => prevOrders.filter(order => order.id !== job.id));
    setCompleteOrders(prevOrders => [...prevOrders, job]);
  }

  return (
    <div>
      {(dataLoading) ?
        (<></>) :
        (
          <div className="flex justify-center my-5">
            <div className="w-1/2 mx-auto">
              <Tabs selectedTabClassName={(isPrinter) ? "brand-tab-selected-printer" : "brand-tab-selected-customer"}>
                <TabList className="flex">
                  <Tab className="w-1/3">
                    <div className="text-xl font-extrabold p-3 text-center cursor-default">
                      {(isPrinter) ? (<>Bid Jobs</>) : (<>Listed Orders</>)}
                    </div>
                  </Tab>
                  <Tab className="w-1/3">
                    <div className="text-xl font-extrabold p-3 text-center cursor-default">
                      {(isPrinter) ? (<>Current Jobs</>) : (<>Accepted Orders</>)}
                    </div>
                  </Tab>
                  <Tab className="w-1/3">
                    <div className="text-xl font-extrabold p-3 text-center cursor-default">
                      {(isPrinter) ? (<>Complete Jobs</>) : (<>Complete Orders</>)}
                    </div>
                  </Tab>
                </TabList>
                <TabPanel>
                  <div className="grid grid-cols-1 gap-4">
                    {listedOrders.map((job) => (<BidJobCard job={job} isPrinter={isPrinter} onSelectJob={() => navigate(`/${(isPrinter) ? "jobs" : "orders"}/${job.id}`)} />))}
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="grid grid-cols-1 gap-4">
                    {acceptedOrders.map((job) => (<JobCard
                      job={job}
                      onSelectJob={(job) => navigate(`/${(isPrinter) ? "jobs" : "orders"}/${job.id}`)}
                      img={job.thumbnail}
                      showLink={!isPrinter && !job.hasLeftReview}
                      linkText="Printer review required"
                      onLinkClicked={() => onRatingLinkClicked(job)}
                    />))}
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="grid grid-cols-1 gap-4">
                    {completeOrders.map((job) => (<JobCard job={job} onSelectJob={(job) => navigate(`/${(isPrinter) ? "jobs" : "orders"}/${job.id}`)} img={job.thumbnail} />))}
                  </div>
                </TabPanel>
              </Tabs>
            </div>
          </div>
        )}
        {showRatingModal &&
          (<RatingModal
          isModalVisible={true}
          onClose={() => setShowRatingModal(false)}
          isCustomer={true}
          targetUserUid={printerUid}
          jobName={jobName}
        />)}
    </div>
  )
}
