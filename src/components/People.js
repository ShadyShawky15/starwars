import React from "react";
import { useQuery } from "@tanstack/react-query";
import Person from "./person"
const Planets = () => {
    const fetchPeople = async () => {
        const response = await fetch("https://swapi.py4e.com/api/people/")
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json()
    }

    // people key we are named it to seperate each query
    const { data, status } = useQuery({ queryKey: ["people"], queryFn: fetchPeople })

    return (
        <div>
            <h2>People</h2>
            {status === "pending" && (<div>loading...</div>)}
            {status === "error" && (<div>fail to get response</div>)}
            {status === "success" && (data.results.map((person) => (
                <Person key={person.name} person={person} />
            )))}
        </div>
    )
}

export default Planets