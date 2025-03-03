/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import axios from "axios";

export default function Page() {
  const [handle, setHandle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      setData(null);
      const response = await axios.post("/api/get-info", {
        handle,
        startDate,
        endDate,
      });
      setData(response.data);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Codeforces Stats</h1>
      <div className="mb-4">
        <label className="block font-medium">Handle:</label>
        <input
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          className="border p-2 w-full rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">Start Date:</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 w-full rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block font-medium">End Date:</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 w-full rounded-md"
        />
      </div>
      <button
        onClick={fetchData}
        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Fetching..." : "Get Stats"}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {data && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h2 className="text-lg font-bold">Results</h2>
          <p><strong>Total Problems Solved:</strong> {data.count}</p>
          <ul className="list-disc pl-6">
            {data.problems.map((problem: string, index: number) => (
              <li key={index}>{problem}</li>
            ))}
          </ul>
          <p className="mt-4"><strong>Incorrect Submissions:</strong> {data.incorrectSubmissions}</p>
          <ul className="list-disc pl-6">
            {data.incorrectProblems.map((problem: string, index: number) => (
              <li key={index}>{problem}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}