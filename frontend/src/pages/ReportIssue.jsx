import ReportMap from "../components/ReportMap";
import { useState } from "react";
import { issueApi } from "../api/issueApi";

const ReportIssue = () => {
  const [photo, setPhoto] = useState(null);
  const [location, setLocation] = useState(null);
  const [accuracy, setAccuracy] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [title, setTitle] = useState("");
  const [issueType, setIssueType] = useState("");
  const [priority, setPriority] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [description, setDescription] = useState("");

  // Reverse Geocoding
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();
      if (data.display_name) {
        setAddress(data.display_name);
      }
    } catch (err) {
      console.error("Reverse geocoding failed", err);
    }
  };

  const fetchCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setLocation(coords);
        setAccuracy(position.coords.accuracy);

        await reverseGeocode(coords.lat, coords.lng);

        setLoadingLocation(false);
      },
      (error) => {
        alert("Location permission denied");
        setLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!location) {
      alert("Please fetch or select a location.");
      return;
    }

    try {
      const formData = new FormData();

      formData.append("title", title);
      formData.append("description", description);
      formData.append("address", address);
      formData.append("latitude", location.lat);
      formData.append("longitude", location.lng);

      if (photo) formData.append("photo", photo);

      await issueApi.createIssue(formData);

      alert("Complaint submitted successfully!");

      setTitle("");
      setIssueType("");
      setPriority("");
      setAddress("");
      setLandmark("");
      setDescription("");
      setPhoto(null);
      setLocation(null);
      setAccuracy(null);

    } catch (err) {
      alert("Submission failed.");
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-5xl">

        <h1 className="text-3xl font-bold mb-6">
          Report a Civic Issue
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >

          <input
            placeholder="Issue Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-3 rounded-xl"
            required
          />

          <select
            value={issueType}
            onChange={(e) => setIssueType(e.target.value)}
            className="border p-3 rounded-xl"
          >
            <option value="">Issue Type</option>
            <option>Garbage</option>
            <option>Pothole</option>
            <option>Water Leakage</option>
            <option>Streetlight</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border p-3 rounded-xl"
          >
            <option value="">Priority</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          <input
            placeholder="Nearby Landmark"
            value={landmark}
            onChange={(e) => setLandmark(e.target.value)}
            className="border p-3 rounded-xl"
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-3 rounded-xl md:col-span-2"
            required
          />

          <input
            placeholder="Address (Editable)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-3 rounded-xl md:col-span-2"
            required
          />

          <div className="md:col-span-2">
            <button
              type="button"
              onClick={fetchCurrentLocation}
              className="mb-3 px-4 py-2 bg-indigo-600 text-white rounded-full"
            >
              Use Current Location
            </button>

            <ReportMap
              location={location}
              setLocation={setLocation}
              accuracy={accuracy}
              loading={loadingLocation}
            />

            {accuracy && (
              <p className="text-sm mt-2">
                GPS Accuracy: {Math.round(accuracy)} meters
              </p>
            )}
          </div>

          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => setPhoto(e.target.files[0])}
            className="md:col-span-2"
          />

          <button
            type="submit"
            className="md:col-span-2 bg-indigo-600 text-white py-3 rounded-full"
          >
            Submit Complaint
          </button>

        </form>
      </div>
    </div>
  );
};

export default ReportIssue;