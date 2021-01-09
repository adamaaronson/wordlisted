import React, { Component } from 'react'

const SORTS = [
    {
        value: "abc",
        name: "ABC"
    },
    {
        value: "length",
        name: "Length"
    }
];

export default class ResultsSorter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentSort: SORTS[0]
        }
    }

    render() {
        return (
            <div className="results-sorter">
                <span className="field-label sorting-label">
                    Sort results by:
                </span>
                {SORTS.map(sort =>
                    <label className="results-sort-wrapper" key={sort.value}>
                        <input className="results-sort-input"
                            type="radio"
                            value={sort.value}
                            name="results-sort"
                            defaultChecked={this.state.currentSort.value === sort.value}
                            key={sort.value}
                            onChange={this.props.onSortChange}
                        />
                        <span className="results-sort-button">

                        </span>
                        <span className="results-sort-label field-label" key={sort.value + "name"}>
                            {sort.name}
                        </span>
                    </label>
                )}
            </div>
        )
    }
}
