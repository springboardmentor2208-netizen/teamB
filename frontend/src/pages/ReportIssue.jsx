import ReportMap from "../components/ReportMap";
import { useState } from "react";
import { issueApi } from "../api/issueApi";

const inputClass =
  "mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

const labelClass =
  "text-[11px] font-semibold tracking-widest text-slate-400 uppercase";

const ReportIssue = () => {
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);

  const [title, setTitle] = useState("");
  const [issueType, setIssueType] = useState("");
  const [priority, setPriority] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!location) {
    alert("Please select a location on the map.");
    return;
  }

  try {
    const complaintData = {
      title,
      issueType,
      priority,
      address,
      landmark,
      description,
      latitude: location.lat,
      longitude: location.lng,
    };

    await issueApi.createIssue(complaintData);

    alert("Complaint submitted successfully!");
  } catch (error) {
    console.error(error);
    alert("Issue API connected, waiting for backend implementation.");
  }
};


  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-5xl">

        {/* Header */}
        <div className="mb-8 ml-1">
          <h1 className="text-3xl font-bold text-slate-800">
            Report a Civic Issue
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Report issues in your area for quick resolution
          </p>
        </div>

        {/* Card */}
        <div className="w-full rounded-[2rem] bg-white px-8 py-8 shadow-lg">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >

            {/* Issue Title */}
            <div className="md:col-span-2">
              <label className={labelClass}>Issue Title</label>
              <input
                className={inputClass}
                placeholder="Short title of the issue"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* Issue Type */}
            <div>
              <label className={labelClass}>Issue Type</label>
              <select
                className={inputClass}
                value={issueType}
                onChange={(e) => setIssueType(e.target.value)}
              >
                <option value="">Select type</option>
                <option value="Garbage">Garbage</option>
                <option value="Pothole">Pothole</option>
                <option value="Water Leakage">Water Leakage</option>
                <option value="Streetlight">Streetlight</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label className={labelClass}>Priority</label>
              <select
                className={inputClass}
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="">Select priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Address */}
            <div>
              <label className={labelClass}>Address</label>
              <input
                className={inputClass}
                placeholder="Street / Area"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            {/* Landmark */}
            <div>
              <label className={labelClass}>Nearby Landmark</label>
              <input
                className={inputClass}
                placeholder="Optional"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea
                rows={3}
                className={inputClass}
                placeholder="Describe the issue in detail"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Map */}
            <div className="md:col-span-2">
              <label className={labelClass}>Location on Map</label>
              <div className="mt-3 rounded-xl overflow-hidden">
                <ReportMap
                  location={location}
                  setLocation={setLocation}
                />
              </div>

              {location && (
                <div className="mt-2 text-sm text-slate-600">
                  <p>Latitude: {location.lat}</p>
                  <p>Longitude: {location.lng}</p>
                </div>
              )}
            </div>

           {/* Upload Photo */}
<div className="md:col-span-2">
  <label className={labelClass}>Upload Issue Photo</label>

  <label className="mt-4 relative flex h-36 w-full cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed border-indigo-400 bg-indigo-50 transition-all duration-200 hover:bg-indigo-100">

    <div className="flex flex-col items-center justify-center text-center">
      {!photo ? (
        <>
          <span className="text-sm font-semibold text-indigo-600">
            Click to upload photo
          </span>
          <span className="mt-1 text-xs text-indigo-400">
            JPG, PNG (Max 5MB)
          </span>
        </>
      ) : (
        <span className="text-sm font-semibold text-indigo-700">
          {photo.name}
        </span>
      )}
    </div>

    <input
      type="file"
      className="absolute inset-0 opacity-0 cursor-pointer"
      onChange={(e) => setPhoto(e.target.files[0])}
    />
  </label>
</div>


            {/* Submit */}
            <div className="md:col-span-2 pt-4">
              <button
                type="submit"
                className="w-full rounded-full bg-indigo-600 py-3 text-sm font-bold text-white hover:bg-indigo-700 transition"
              >
                Submit Complaint
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
