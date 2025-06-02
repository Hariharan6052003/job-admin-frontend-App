'use client';
import Link from 'next/link';
import { Slider } from "@mui/material";
import CreateJobModal from '@/app/CreateJobModel.js';
import { useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { useState } from 'react';
import './style/page.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faUserPlus } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faBuildingUser } from '@fortawesome/free-solid-svg-icons';
import { faLayerGroup } from '@fortawesome/free-solid-svg-icons';

export default function DashboardHomePage() {

  const [jobs, setJobs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [value, setValue] = useState([10, 100]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/save-job');
        setJobs(response.data);
      } catch (err) {
        console.error('Error fetching jobs:', err);
      }
    };

    fetchJobs();
  }, []);




  function parseTimestampAsUTC(timestamp) {
    if (!timestamp) return null;

    // Handle ISO timestamps like '2025-06-02T10:15:30Z' directly
    if (timestamp.endsWith('Z')) {
      return new Date(timestamp); // JS will parse it as UTC
    }

    // Parse timestamps like 'YYYY-MM-DD HH:mm:ss' or 'YYYY-MM-DDTHH:mm:ss'
    const parts = timestamp.split(/[- :T]/);

    if (parts.length < 3) return null; // invalid format

    const [year, month, day, hour = 0, minute = 0, second = 0] = parts.map(Number);
    return new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  }

  function getCompanyLogo(company) {
    const lower = company?.toLowerCase() || '';
    if (lower.includes('amazon')) return '/img/amazon.png';
    if (lower.includes('microsoft')) return '/img/microsoft.png';
    if (lower.includes('swiggy')) return '/img/swiggy.png';
    if (lower.includes('ibm')) return '/img/ibm.png';
    if (lower.includes('tesla')) return '/img/tesla.png';
    if (lower.includes('tcs')) return '/img/tcs.png';
    return '/img/default.png';
  }


  function getTimeAgo(timestamp) {
    const posted = parseTimestampAsUTC(timestamp);
    if (!posted || isNaN(posted.getTime())) return "Just now";

    const now = new Date();
    const diff = Math.floor((now - posted) / 1000); // diff in seconds

    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} day ago`;

    return posted.toLocaleDateString();
  }



  // Format the value to show ₹xk
  const formatCurrency = (val) => `₹${val}k`;

  return (
    <div className="container">
      <main className="main-content">
        <center>
          <nav className="navbar">

            {/* Left Nav Links */}
            <img src="/logo.png" alt="Logo" className="logo" />
            <div className="nav-links">
              <Link href="/" className="nav-link">Home</Link>
              <Link href="/jobs" className="nav-link">Find Job</Link>
              <Link href="/talent" className="nav-link">Find Talent</Link>
              <Link href="/about" className="nav-link">About Us</Link>
              <Link href="/testimonials" className="nav-link">Testimonials</Link>
            </div>

            {/* Right Button */}
            <div>
              <button
                className="btn-create-job"
                onClick={() => setShowModal(true)}
              >
                Create Job
              </button>

            </div>
          </nav>
        </center>

        <div className="flex items-center justify-between  mt-8">
          <div className="flex items-center gap-1 ">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
            <input
              type="text"
              placeholder="Search By Job Title, Role"
              className="outline-none bg-transparent text-gray-800 placeholder-gray-400"
            />
          </div>

          <div className="border-l h-6 border-gray-300 " />

          <div className="flex items-center gap-1">
            <FontAwesomeIcon icon={faLocationDot} className="search-icon" />

            <select className="outline-none bg-transparent text-gray-500">
              <option>Preferred Location&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
            </select>
          </div>

          <div className="border-l h-6 border-gray-300 " />

          <div className="flex items-center gap-1">
            <img src="/pic-1.png" alt="Location Icon" className="w-6 h-5" />

            <select className="outline-none bg-transparent text-gray-500">
              <option>Job type&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</option>
            </select>
          </div>

          <div className="border-l h-6 border-gray-300 " />

          <div className="flex flex-col gap-1 w-64">
            <div className="flex justify-between text-gray-600 text-sm">
              <span>Salary Per Month</span>
              <span>{`${formatCurrency(value[0])} - ${formatCurrency(value[1])}`}</span>
            </div>
            <Slider
              value={value}
              min={10}
              max={100}
              step={5}
              onChange={handleChange}
              valueLabelDisplay="auto"
              valueLabelFormat={formatCurrency}
              sx={{
                color: 'white', // Sets the slider track color
                '& .MuiSlider-thumb': {
                  backgroundColor: 'white',
                  border: '5px solid black', // Creates the hole illusion
                  width: 15,
                  height: 15,
                  '&::before': {
                    boxShadow: 'none', // Remove the default shadow
                  },
                },
                '& .MuiSlider-track': {
                  backgroundColor: 'black',
                },
                '& .MuiSlider-rail': {
                  backgroundColor: '#ccc',
                },
              }}
            />

          </div>


        </div>
      </main>
      <div className="middle-content">
        {jobs.map((job) => (
          <div className="job-card" key={job.id}>
            <div className="job-card-header">
              <Image
                src={getCompanyLogo(job.company)}
                alt={`${job.company} Logo`}
                width={100}
                height={100}
                className="job-logo"
              />


              <span className="posted-time">
                {getTimeAgo(job.created_at)}
              </span>


            </div>

            <h3 className="job-title">{job.title}</h3>

            <div className="job-meta">
              <span><FontAwesomeIcon icon={faUserPlus} size="1x" color="grey" />1–3yr Exp </span>
              <span><FontAwesomeIcon icon={faBuildingUser} size="1x" color="grey" />
                {job.job_type} </span>
              <span><FontAwesomeIcon icon={faLayerGroup} />   {Math.round(((job.salary_min + job.salary_max) / 2) / 100000)}LPA</span>

            </div>
            <ul className="job-desc-list" style={{ listStyleType: 'none', paddingLeft: 0 }}>
              {job.description
                ? job.description
                  .split(/\r?\n/)          // split by new lines (Windows & Unix)
                  .map(line => line.trim()) // trim spaces
                  .filter(line => line !== "") // ignore empty lines
                  .map((line, index) => (
                    <li key={index}>• {line}</li>
                  ))
                : null
              }
            </ul>





            <button className="apply-btn">Apply Now</button>
          </div>
        ))}
      </div>


      {showModal && <CreateJobModal onClose={() => setShowModal(false)} />}

    </div>
  );
}
