import React from "react";
import PropTypes from 'prop-types';
import base from '../base';
import Header from "./Header";
import Inventory from "./Inventory";
import Order from "./Order";
import sampleFishes from "../sample-fishes";
import Fish from './Fish';
 
class App extends React.Component { 
    state = {
        fishes: {},
        order: {}
    };

    static propTypes = {
        match: PropTypes.object
    }

    componentDidMount() {
        const { params } = this.props.match;
        const localStorageRef = localStorage.getItem(params.storeId);
        
        if(localStorageRef){
            this.setState({
                order: JSON.parse(localStorageRef)
            })
        }
        this.ref = base.syncState(`${params.storeId}/fishes`, {
            context: this,
            state: 'fishes'
        })
    }
    
    componentDidUpdate() {
        localStorage.setItem(this.props.match.params.storeId, JSON.stringify(this.state.order));
    }

    componentWillUnmount() {
        base.removeBinding(this.ref);
    }

    addFish = fish => {
        const fishes = { ...this.state.fishes };

        fishes[`fish${Date.now()}`] = fish;
        this.setState({
            fishes: fishes
        });
    };

    loadSampleFishes = () => {
        this.setState({
            fishes: sampleFishes
        });
    };

    addOrderItem = (key) => {

        const order = { ...this.state.order };

        order[key] = order[key] + 1 || 1;

        this.setState({
           order
        });
    };

    updateFish = (key, updatedFish) => {
        // Take a copy of the current state
        const fishes = { ...this.state.fishes };
        // Update that state 
        fishes[key] = updatedFish;
        // Set it to state 
        this.setState({fishes});
    }

    deleteFish = key => {
        // 1. Copy state 
        const fishes = { ...this.state.fishes};

        // update the state - firebase
        fishes[key] = null;

        // update state 
        this.setState({fishes})
    }

    deleteOrderItem = key => {
        // 1. Copy state 
        const order = { ...this.state.order};

        // update the state - firebase
        delete order[key];

        // update state 
        this.setState({order})
    }

    render() {
        return (
            <div className="catch-of-the-day">
                <div className="menu">
                    <Header tagline="Hello testing" age={1200}/>
                    <ul className="fishes">
                        {Object.keys(this.state.fishes).map(key => <Fish key={key} index={key} details={this.state.fishes[key]} addOrderItem={this.addOrderItem}/>)}
                    </ul>
                </div>
                <Order fishes={this.state.fishes} order={this.state.order} deleteOrderItem={this.deleteOrderItem} />
                <Inventory addFish={this.addFish} updateFish={this.updateFish} deleteFish={this.deleteFish} loadSampleFishes={this.loadSampleFishes} fish={this.state.fishes} />
            </div>
        )
    }
}

export default App;