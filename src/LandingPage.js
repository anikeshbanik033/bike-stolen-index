import React, { useEffect, useState } from 'react';
import Moment from "moment";
import axios from 'axios';
import ReactPaginate from "react-paginate";
import { makeStyles } from '@material-ui/styles';
import logo from './assets/images/logo.png'
import NoImage from './assets/images/NoImage.png'
import './App.css';
import { Loader } from './Loader'


const clsses = makeStyles(theme => ({
  imageSize: {
    height: '11rem',
  },
  card: {
    // height: '13rem'
  },
  title: {
    fontSize: '15px',
    fontWeight: '500',
    color: '#007bff',
  },
  description: {
    fontSize: '15px',
  },
  searchBox: {
    borderRadius: '4px',
    fontSize: '14px'
  },
  fontSize30: {
    fontSize: '30px',
    wordBreak: 'break-word'
  }
}))

function LandingPage() {
  const a = clsses();
  const limit = 10;

  const [incidentList, setIncidentList] = useState(null);
  const [searchContent, setSearchContent] = useState(null);
  const [activePage, setActivePage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [offset, setOffset] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loader, setLoader] = useState(true);
  const [errorState, setErrorState] = useState(false);

  useEffect(() => {
    getIncidentsList(offset);
  }, []);

  // to fetch list of incidents
  const getIncidentsList = (page) => {
    setOffset(page);
    setIncidentList(null);
    setLoader(true);
    axios({
      method: 'get',
      url: `https://bikewise.org:443/api/v2/incidents?${searchContent ? `&query=${searchContent}` : ''}&per_page=${limit}&page=${page}&occurred_after=${startDate ? startDate : ''}&occurred_before=${endDate ? endDate : ''}`,
      contentType: 'application/json; charset=utf-8',
    })
      .then((success) => {
        if (success && success.data) {
          setLoader(false);
          setIncidentList(success && success.data && success.data.incidents);
          if (searchContent === null || searchContent === '') {
            setPageCount(118886 / limit)
          }
          else {
            setPageCount(0);
            setErrorState(true);
          }
        }
      })
      .catch((responce) => {
      })
  }

  function setOffsetHandler(e) {
    setActivePage(e.selected)
    getIncidentsList(e.selected + 1);
  }


  const setFilter = (e) => {
    e.preventDefault();
    getIncidentsList(1);
  }

  return (
    <div className={`container`}>
      <div className={`row justify-content-center`}>
        <div className={`col-sm-12 col-md-12 col-lg-10`}>
          <div className={`mb-4 mt-3 row`}>
            <div className="col-sm-12 col-md-12 col-lg-12 pl-lg-0 d-flex mb-4">
              <img src={logo} alt="logo img" />
              <p className="pt-4 ml-5">
                <span className={`font-weight-bold ${a.fontSize30}`}>
                  Police Departament of Berlin
                </span>
                <br />
                <span className={`${a.description}`}>
                  Stolen Bykes
                </span>
              </p>
            </div>
            <div className={`col-sm-12 col-md-4 col-lg-5`}>
              <input className={`pl-2 w-100 ${a.searchBox}`} placeholder="Search by description" type="text" onChange={(e) => setSearchContent(e.target.value)} />
            </div>

            <div className={`col-sm-12 col-md-8 col-lg-7 pr-0`}>
              <span>from</span> - <input className={`mr-2`} type="date" onChange={(e) => setStartDate(parseInt(new Date(e.target.value).getTime()))} />
              <span>to</span> - <input type="date" onChange={(e) => setEndDate(parseInt(new Date(e.target.value).getTime()))} />

              <button className={`btn btn-dark btn-sm font-weight-bold ml-2 mt-md-2 mt-lg-0`} onClick={(e) => setFilter(e)}>Find Case</button>
            </div>
          </div>
        </div>
        {
          loader ?
            <div className={`col-sm-12 col-md-12 col-lg-10 mt-3 pt-2 pb-2`}>
              <Loader />
            </div>
            :
            incidentList && incidentList.length > 0 ? incidentList.map((item) =>
              <div className={`col-sm-12 col-md-12 col-lg-10 shadow card mt-3 pt-2 pb-2 ${a.card}`}>
                <div className={`row ${a.colorT}`}>
                  <div className={`col-sm-3 col-lg-3 col-md-3`}>
                    <img src={item.media.image_url ? item.media.image_url : NoImage} className={`img-fluid w-100 ${a.imageSize}`} height="300" alt="card img" />
                  </div>
                  <div className={`col-sm-8 col-lg-8 col-md-8`}>
                    <p className={` ${a.title}`}>{item.title}</p>
                    <p className={`${a.description}`}>{item.description}</p>
                    <p className={`${a.description}`}>
                      {Moment(item.occurred_at).format("dddd MMM DD, YYYY")} -
                      {item.address}
                    </p>
                  </div>
                </div>
              </div>
            )

              : errorState === false ?
                <div className="col-sm-12 col-md-12 col-lg-10">
                  No results
              </div>
                :
                <div className="col-sm-12 col-md-12 col-lg-10 text-danger">
                  Oops, something went wrong
                 </div>
        }

        <div className="mt-5">
          {
            incidentList && incidentList.length > 0 ?
              <ReactPaginate
                previousLabel={<i className="fa fa-angle-left" />}
                nextLabel={<i className="fa fa-angle-right" />}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={pageCount}
                forcePage={activePage}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={(e) => setOffsetHandler(e)}
                containerClassName={"pagination mt-n4 justify-content-end"}
                subContainerClassName={"pages pagination"}
                activeClassName={"active"}
              /> : ''
          }
        </div>
      </div>
    </div>
  )
}


export default LandingPage;