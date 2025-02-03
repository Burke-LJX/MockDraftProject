import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import Card from "./Card";
import RoundTitle from "./RoundTitle";

// Helper function to map round numbers to Firestore labels
const getRoundLabel = (roundNumber) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const v = roundNumber % 100;
    const suffix = (v > 10 && v < 14) ? "th" : suffixes[(v % 10)] || "th";
    return `${roundNumber}${suffix} Round`; // Example: "1st Round", "2nd Round"
};

function PicksTable() {
    const [activeRound, setActiveRound] = useState(1); // Default to 1st round
    const [draftData, setDraftData] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDraftData = async () => {
            setLoading(true); // Set loading state
            try {
                const teamsCollection = collection(db, "Draft_Picks");
                const teamsSnapshot = await getDocs(teamsCollection);

                const data = {};

                for (const teamDoc of teamsSnapshot.docs) {
                    const teamName = teamDoc.id; // Each document in `Draft_Picks` is a team
                    const picksCollection = collection(teamDoc.ref, "Picks");
                    const picksSnapshot = await getDocs(picksCollection);

                    picksSnapshot.forEach((pickDoc) => {
                        const pickData = pickDoc.data();
                        const { Round: round, Selection: selection } = pickData; // Use Firestore field names
                        const pickNumber = parseInt(pickDoc.id); // Pick number as document ID

                        if (!data[round]) data[round] = [];
                        data[round].push({ pick: pickNumber, team: teamName, selection });
                    });
                }

                // Sort picks in each round by pick number
                Object.keys(data).forEach((round) => {
                    data[round].sort((a, b) => a.pick - b.pick);
                });

                setDraftData(data); // Save the processed data
            } catch (error) {
                console.error("Error fetching draft data:", error);
            } finally {
                setLoading(false); // Stop loading state
            }
        };

        fetchDraftData();
    }, []);

    const roundKey = getRoundLabel(activeRound); // Convert active round to Firestore label

    return (
        <div>
            <RoundTitle activeRound={activeRound} setActiveRound={setActiveRound} />
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-blue-100">
                    <thead className="text-xs text-white uppercase bg-blue-600 border-b border-blue-400">
                        <tr>
                            <th scope="col" className="px-5 py-3">Pick</th>
                            <th scope="col" className="px-6 py-3">Selection</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="3" className="px-6 py-4 text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : draftData[roundKey] && draftData[roundKey].length > 0 ? (
                            draftData[roundKey].map((data, index) => (
                                <tr key={index} className="bg-blue-600 border-b border-blue-400 hover:bg-blue-500">
                                    <Card text={`Pick ${data.pick}`} Team={data.team} />
                                    <td className="px-6 py-4">{data.selection || "TBD"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" className="px-6 py-4 text-center">
                                    No picks found for this round
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PicksTable;
