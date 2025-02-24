import { useState, useEffect } from "react";
import "./Commandes.css";
import data from "./data";

const Commandes = () => {
  const [filteredData, setFilteredData] = useState([]);
  const [filterName, setFilterName] = useState("");
  const [filterGroup, setFilterGroup] = useState("");

  useEffect(() => {
    filterData();
  }, [filterName, filterGroup]);

  const filterData = () => {
    const filtered = data
      .filter(
        (person) =>
          person.nom &&
          person.nom.toLowerCase().includes(filterName.toLowerCase()) &&
          person.groupe.toLowerCase().includes(filterGroup.toLowerCase())
      )
      .sort((a, b) => a.nom.localeCompare(b.nom)); // Tri par ordre alphabétique

    setFilteredData(filtered);
  };

  const resetFilter = () => {
    setFilterName("");
    setFilterGroup("");
    filterData();
  };

  const calculateTotalPublications = () => {
    const publicationCounts = {};

    filteredData.forEach((person) => {
      person.commandes.forEach((command) => {
        if (command.type) {
          if (!publicationCounts[command.publication]) {
            publicationCounts[command.publication] = {
              total: 0,
              languages: {},
            };
          }

          command.details.forEach((detail) => {
            if (detail.langue) {
              if (
                !publicationCounts[command.publication].languages[detail.langue]
              ) {
                publicationCounts[command.publication].languages[
                  detail.langue
                ] = 0;
              }

              publicationCounts[command.publication].languages[detail.langue] +=
                parseInt(detail.quantite);
              publicationCounts[command.publication].total += parseInt(
                detail.quantite
              );
            }
          });
        }
      });
    });

    return publicationCounts;
  };

  const publicationTotals = calculateTotalPublications();

  const groupCommandsByType = (commands) => {
    const grouped = { Permanente: {}, Annuelle: {} };

    commands.forEach((command) => {
      if (!grouped[command.type][command.publication]) {
        grouped[command.type][command.publication] = [];
      }
      grouped[command.type][command.publication].push(...command.details);
    });

    return grouped;
  };

  return (
    <div className="commandes">
      <div className="filters">
        <input
          type="text"
          placeholder="Filtrer par nom"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Filtrer par groupe"
          value={filterGroup}
          onChange={(e) => setFilterGroup(e.target.value)}
          max={7}
          min={0}
        />
        <button onClick={resetFilter}>Réinitialiser</button>
      </div>

      <div id="command-list">
        {filteredData.map((person, index) => {
          const groupedCommands = groupCommandsByType(person.commandes);

          return (
            <div key={index} className="card">
              <span>
                <strong>Groupe:</strong> {person.groupe}
              </span>
              <span>
                <strong>Nom:</strong> {person.nom}
              </span>
              <div className="command-details">
                {Object.keys(groupedCommands).map((type) => (
                  <div key={type}>
                    <strong className="command-type">{type}</strong>
                    {Object.keys(groupedCommands[type]).map(
                      (publication, idx) => (
                        <div key={idx}>
                          <strong
                            style={{
                              fontSize: "1.2em",
                              color: "#333",
                              fontWeight: "bold",
                              marginBottom: "5px",
                              borderBottom: "2px solid #4a90e2",
                              paddingBottom: "5px",
                              display: "inline-block",
                            }}
                          >
                            {publication}
                          </strong>
                          {groupedCommands[type][publication].map(
                            (detail, i) => (
                              <span key={i}>
                                <br />
                                <strong>{detail.quantite}</strong>{" "}
                                <strong>{detail.langue}</strong>
                              </span>
                            )
                          )}
                        </div>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="totaux-pub">
        <h3>Totaux des publications</h3>
        <ul>
          {Object.keys(publicationTotals).map((publication, idx) => (
            <li key={idx}>
              {publication} - Total: {publicationTotals[publication].total}
              <ul>
                {Object.keys(publicationTotals[publication].languages).map(
                  (language, i) => (
                    <li key={i}>
                      {language}:{" "}
                      {publicationTotals[publication].languages[language]}
                    </li>
                  )
                )}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <button
        className="scroll-to-top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        Haut de page
      </button>
    </div>
  );
};

export default Commandes;
