import React, { useState } from "react";

export default function CdCollection({ collectionData }) {
  const [view, setView] = useState("covers");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = collectionData.filter((item) => {
    const title = item.basic_information.title.toLowerCase();
    return title.includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setView("covers")}>Album Covers</button>
        <button onClick={() => setView("list")}>Lijstweergave</button>
        <input
          type="text"
          placeholder="Zoeken..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginLeft: "1rem" }}
        />
      </div>
      {view === "covers" ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
          {filteredData.map((item) => (
            <img
              key={item.id}
              src={item.basic_information.cover_image}
              alt={item.basic_information.title}
              style={{ width: "150px", height: "150px", objectFit: "cover" }}
            />
          ))}
        </div>
      ) : (
        <ul>
          {filteredData.map((item) => (
            <li key={item.id}>{item.basic_information.title}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
