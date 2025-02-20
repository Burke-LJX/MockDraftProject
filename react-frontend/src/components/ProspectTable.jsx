import { useState, useEffect } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../../firebaseConfig";

function ProspectTable() {
    const [prospects, setProspects] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchField, setSearchField] = useState("id");

    useEffect(() => {
        const fetchProspects = async () => {
            try {
                // Query Firestore to get prospects sorted by Rank
                const q = query(collection(db, "Prospects"), orderBy("Rank"));
                const querySnapshot = await getDocs(q);

                const players = querySnapshot.docs.map((doc) => ({
                    id: doc.id, // Player Name (document ID)
                    ...doc.data(), // Position, Rank, School
                }));

                setProspects(players);
            } catch (error) {
                console.error("Error fetching prospects: ", error);
            }
        };

        fetchProspects();
    }, []);

    const filteredProspects = prospects.filter((prospect) => {
        const value = String(prospect[searchField] || "").toLowerCase();
        return value.includes(searchTerm.toLowerCase());
    });

    return (
        <div className="relative overflow-x-auto max-w-3xl max-h-96 shadow-md sm:rounded-lg p-4">
            
            <div className="flex items-center space-x-2 mb-4">
                {/* Dropdown */}
                <select
                    className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={searchField}
                    onChange={(e) => setSearchField(e.target.value)}
                >
                    <option value="id">Name</option>
                    <option value="Position">Position</option>
                    <option value="School">School</option>
                </select>

                {/* Search Bar */}
                <input
                    type="text"
                    placeholder={`Search by ${searchField}...`}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Scrollable Table */}
            <div className="relative overflow-x-auto max-w-3xl max-h-56 overflow-y-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th className="px-6 py-3">Player Name</th>
                            <th className="px-6 py-3">Position</th>
                            <th className="px-6 py-3">Rank</th>
                            <th className="px-6 py-3">School</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProspects.map((player) => (
                            <tr key={player.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    {player.id}
                                </td>
                                <td className="px-6 py-4">{player.Position || "N/A"}</td>
                                <td className="px-6 py-4">{player.Rank || "N/A"}</td>
                                <td className="px-6 py-4">{player.School || "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ProspectTable;
