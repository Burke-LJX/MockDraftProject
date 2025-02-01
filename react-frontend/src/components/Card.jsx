import React from 'react'
function Card(props) {
    return (
<div class="max-w-sm p-1 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-600 dark:border-gray-700">
    <a href="#">
        <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">{props.text}</h5>
    </a>
    <p class="mb-3 font-normal font-semibold text-gray-500 dark:text-gray-400">{props.Team}</p>
</div>
    )}

export default Card