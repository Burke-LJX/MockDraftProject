import { useState } from "react";

function RoundTitle() {
    const [activeRound, setActiveRound] = useState(1); // Default active round is 1

    const rounds = [1, 2, 3, 4, 5, 6, 7];

    return (
        <div>
            <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                {rounds.map((round) => (
                    <li key={round} className="me-2">
                        <button
                            className={`inline-block px-4 py-3 rounded-lg ${
                                activeRound === round
                                    ? "text-white bg-blue-600"
                                    : "hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white"
                            }`}
                            type="button"
                            role="tab"
                            onClick={() => setActiveRound(round)} // Set active round on click
                        >
                            Round {round}
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RoundTitle;
