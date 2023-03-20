import React from "react"
import EventApi from "@api/EventApi"
import {getToken} from "@services/EventServices"
import {globalEventDistributor} from "@app/App"
const token: string | null = getToken()
export class EventWeb extends React.Component<Readonly<any>, {id: number | null; newEventsToValidate: any[]}> {
    constructor(props) {
        super(props)
        this.state = {id: null, newEventsToValidate: []}
    }
    componentDidMount() {
        if (globalEventDistributor) {
            const id = globalEventDistributor.on(
                "product",
                data => {
                    this.setState({newEventsToValidate: [...this.state.newEventsToValidate, data]})
                },
                true
            )
            this.setState({id})
        }
    }
    componentWillUnmount() {
        if (this.state.id) {
            globalEventDistributor && globalEventDistributor.off(this.state.id)
            this.setState({id: null})
        }
    }
    render() {
        return (
            <div className="section-app__item">
                <p>Event list</p>
                <EventApi token={token} newEventsToValidate={this.state.newEventsToValidate} />
            </div>
        )
    }
}
