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
                <table className="w-full table-auto text-sm text-left text-blue-100">
                    <thead className="text-xs text-white uppercase bg-blue-600 border-b border-blue-400">
                        <tr>
                            <th scope="col" className="px-5 py-3">Pick</th>
                            <th scope="col" className="px-6 py-3">Selection</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                
<div role="status">
    <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin text-center dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span class="sr-only">Loading...</span>
</div>

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
