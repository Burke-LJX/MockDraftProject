import React from 'react'
function Card(props) {
    return (
        
<a href="#" class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow-sm md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
<img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-25 md:rounded-none md:rounded-s-lg" src="https://content.sportslogos.net/logos/7/160/thumbs/1053.gif" alt=""/>
    <div class="flex flex-col justify-between p-4 leading-normal">  
        <h5 class="mb-2 text-4xl font-semibold tracking-tight text-gray-900 dark:text-white">{props.text}</h5>
        <p class="mb-3 text-2xl font-normal font-semibold text-gray-500 dark:text-gray-400">{props.Team}</p>
    </div>
    <div class="flex flex-col justify-between p-4 leading-normal"> 
    <h5 class="mb-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">Player: Pos:       COL:</h5>
    </div>
</a>
    )}

export default Card