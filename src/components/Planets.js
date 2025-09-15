import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Planet from "./planet"

const fetchPlanets = async ({ queryKey }) => {
    // desructuring queryKey from the object
    const [_key, page] = queryKey
    const response = await fetch(`https://swapi.py4e.com/api/planets/?page=${page}`)
    if (!response.ok) {
        throw new Error("Network response was not ok");
    }
    return response.json()
}

const Planets = () => {
    const [page, setPage] = useState(1)

    // stale time is time that fresh data is keeping it until is is stale 
    // refetchInterval check each specific time Is there updates in data from backend or anywhere??! even if fresh still is not stale
    // default values : staletime:0 , cachetime:5000
    const { data, status, isFetching, isPreviousData } = useQuery({
        queryKey: ["planets", page],
        queryFn: fetchPlanets,
        keepPreviousData: true,
        staleTime: 0,
        cacheTime: 5000,
        onSuccess: (newData) => {
            setPage(newData); // update once fresh data comes
        },
    })

    return (
        <div>
            <h2>Planets - Page {page}</h2>
            <button onClick={() => setPage((old) => Math.max(old - 1, 1))} disabled={page === 1}>
                Prev
            </button>
            <button
                onClick={() => {
                    if (!isPreviousData && data?.next) {
                        setPage((old) => old + 1);
                    }
                }}
                disabled={!data?.next}
            >
                Next
            </button>
            {status === "pending" && (<div>loading...</div>)}
            {status === "error" && (<div>Error in fetching data</div>)}
            {status === "success" && (data.results.map((planet) => (
                <Planet key={planet.name} planet={planet} />
            )))}
        </div>
    )
}

export default Planets