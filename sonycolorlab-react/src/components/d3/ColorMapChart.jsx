import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useAppContext } from '../../context/AppContext';
import recipesData from '../../services/recipes';
import { fetchTrendingRecipeIds } from '../../services/api';

const ColorMapChart = ({ onNodeClick }) => {
    const { selectedRecipeId, firebase: { db }, setChart } = useAppContext();
    const svgRef = useRef(null);
    const [trendingIds, setTrendingIds] = useState([]);

    // Fetch trending IDs on mount
    useEffect(() => {
        // In the original, appId was from state, hardcoding for now
        const appId = "YOUR_APP_ID";
        fetchTrendingRecipeIds(db, appId).then(setTrendingIds);
    }, [db]);

    // Main D3 rendering effect
    useEffect(() => {
        if (!svgRef.current || recipesData.length === 0) return;

        const container = d3.select(svgRef.current);
        container.selectAll("*").remove(); // Clear previous chart

        const bounds = svgRef.current.getBoundingClientRect();
        if (bounds.width === 0 || bounds.height === 0) return;

        const margin = { top: 40, right: 30, bottom: 50, left: 30 };
        const width = bounds.width - margin.left - margin.right;
        const height = bounds.height - margin.top - margin.bottom;

        const svg = container.append("svg")
            .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // ... (The rest of the D3 code from features.js) ...
        const xScale = d3.scaleLinear().domain([-11, 11]).range([0, width]);
        const yScale = d3.scaleLinear().domain([-11, 11]).range([height, 0]);
        const rScale = d3.scaleSqrt().domain([0, 20]).range([7, 15]);

        // ... Quadrant labels, grid, axis labels ...
        const quadrantLabels = [
            { x: width * 0.25, y: height * 0.25, text: 'COOL & PUNCHY' },
            { x: width * 0.75, y: height * 0.25, text: 'WARM & VIBRANT' },
            { x: width * 0.25, y: height * 0.75, text: 'COOL & MUTED' },
            { x: width * 0.75, y: height * 0.75, text: 'WARM & FADED' },
        ];
        svg.selectAll(".quadrant-label").data(quadrantLabels).enter().append("text")
            .attr("class", "quadrant-label").attr("x", d => d.x).attr("y", d => d.y)
            .attr("dy", "0.35em").text(d => d.text);

        // ... Grid lines ...
        svg.append("g").attr("class", "grid").call(d3.axisBottom(xScale).ticks(10).tickSize(height).tickFormat("")).selectAll("line").attr("stroke", "#f1f5f9").attr("stroke-opacity", 0.7);
        svg.append("g").attr("class", "grid").call(d3.axisLeft(yScale).ticks(10).tickSize(-width).tickFormat("")).selectAll("line").attr("stroke", "#f1f5f9").attr("stroke-opacity", 0.7);
        svg.selectAll(".domain").remove();

        const nodesData = recipesData.filter(d => d.coords).map(d => ({...d, isTrending: trendingIds.includes(d.id)}));

        const nodeGroups = svg.selectAll(".color-map-node-group")
            .data(nodesData, d => d.id)
            .enter()
            .append("g")
            .attr("class", "color-map-node-group")
            .on("click", (event, d) => {
                if (onNodeClick) {
                    onNodeClick(d.id);
                }
            })
            .style("cursor", "pointer");

        nodeGroups.append("circle")
            .attr("class", "color-map-node-core")
            .attr("r", d => rScale(Math.abs(d.coords.x) + Math.abs(d.coords.y)))
            .attr("fill", d => d.personalityColor);

        // Store nodes in context so they can be updated
        setChart(prev => ({ ...prev, nodes: nodeGroups }));

        const simulation = d3.forceSimulation(nodesData)
            .force("collide", d3.forceCollide().radius(d => rScale(Math.abs(d.coords.x) + Math.abs(d.coords.y)) + 3).strength(0.8))
            .force("x", d3.forceX(d => xScale(d.coords.x)).strength(0.1))
            .force("y", d3.forceY(d => yScale(d.coords.y)).strength(0.1))
            .on("tick", () => {
                nodeGroups.attr("transform", d => `translate(${d.x}, ${d.y})`);
            });

        setChart(prev => ({ ...prev, simulation }));

    }, [trendingIds, onNodeClick, setChart]); // Rerun if data or callbacks change

    // Effect for updating selection
    useEffect(() => {
        const { nodes } = useAppContext().chart;
        if (nodes) {
            nodes.classed("selected", d => d.id === selectedRecipeId);
        }
    }, [selectedRecipeId, useAppContext().chart]);

    return (
        <div ref={svgRef} className="w-full h-full">
            {/* D3 chart will be rendered here */}
        </div>
    );
};

export default ColorMapChart;
