import React, {useEffect, useState} from "react"
import {ApiSystem, EventModel} from "@xotomicro/xotomicro-front-common-registry"

function EventApi({token, newEventsToValidate}: {token: string | null; newEventsToValidate: {id: number; name: string; description: string}[]}) {
    const [events, setEvents]: any = useState(null)
    const [loading, setLoading]: any = useState(false)

    useEffect(() => {
        // eslint-disable-next-line prettier/prettier
        ;(async () => {
            setLoading(true)
            const data = await ApiSystem.getRequest({url: `http://${process.env.SERVICE_URL}:8080/events`})
            setEvents(data)
            setLoading(false)
        })()
    }, [token])

    if (loading) return <p>Loading...</p>

    console.log(newEventsToValidate)

    let valid = true

    for (const eventToValidate of newEventsToValidate) {
        const foundEvent = events.find(event => {
            const eventValue = event.value
            if (eventValue === JSON.stringify(eventToValidate)) {
                return true
            }
        })
        if (!foundEvent) valid = false
    }

    if (events && Array.isArray(events)) {
        return (
            <div className="user">
                <table>
                    <thead>
                        <tr>
                            <th>Topic</th>
                            <th>Partition</th>
                            <th>Offset</th>
                            <th>Timestamp</th>
                            <th>Value</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event: EventModel, index: React.Key | null | undefined) => (
                            <tr key={index}>
                                <td>{event.topic}</td>
                                <td>{event.partition}</td>
                                <td>{event.offset}</td>
                                <td>{event.timestamp}</td>
                                <td>{event.value}</td>
                                <th>{newEventsToValidate.find(e => JSON.stringify(e) === event.value) ? "New - Validated ✅" : ""}</th>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {valid ? <div style={{backgroundColor: "green", padding: "20px", color: "white"}}>All events are valid!</div> : <p>The events are not valid!</p>}
            </div>
        )
    }

    return <p>Cannot load data</p>
}

export default EventApi
