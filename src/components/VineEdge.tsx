'use client';

import React from 'react';
import { EdgeProps, getBezierPath } from '@xyflow/react';

export function VineEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
  markerEnd,
  label,
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Calculate control points using the same logic as ReactFlow
  const distance = Math.sqrt(Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2));
  const curvature = 0.25;
  
  let controlPoint1X = sourceX;
  let controlPoint1Y = sourceY;
  let controlPoint2X = targetX;
  let controlPoint2Y = targetY;
  
  if (sourcePosition === 'right') {
    controlPoint1X = sourceX + distance * curvature;
  } else if (sourcePosition === 'left') {
    controlPoint1X = sourceX - distance * curvature;
  } else if (sourcePosition === 'top') {
    controlPoint1Y = sourceY - distance * curvature;
  } else if (sourcePosition === 'bottom') {
    controlPoint1Y = sourceY + distance * curvature;
  }
  
  if (targetPosition === 'right') {
    controlPoint2X = targetX + distance * curvature;
  } else if (targetPosition === 'left') {
    controlPoint2X = targetX - distance * curvature;
  } else if (targetPosition === 'top') {
    controlPoint2Y = targetY - distance * curvature;
  } else if (targetPosition === 'bottom') {
    controlPoint2Y = targetY + distance * curvature;
  }

  // Generate our own bezier path to ensure perfect alignment
  const customBezierPath = `M ${sourceX},${sourceY} C ${controlPoint1X},${controlPoint1Y} ${controlPoint2X},${controlPoint2Y} ${targetX},${targetY}`;

  // Calculate positions for leaf decorations along the curved bezier path
  const pathLength = Math.sqrt(Math.pow(targetX - sourceX, 2) + Math.pow(targetY - sourceY, 2));
  const leafPositions = [];
  const numLeaves = Math.floor(pathLength / 60); // One leaf every 60 pixels
  
  // Function to calculate point on bezier curve using the same control points
  const getBezierPoint = (t: number) => {
    const x = Math.pow(1 - t, 3) * sourceX + 
              3 * Math.pow(1 - t, 2) * t * controlPoint1X + 
              3 * (1 - t) * Math.pow(t, 2) * controlPoint2X + 
              Math.pow(t, 3) * targetX;
              
    const y = Math.pow(1 - t, 3) * sourceY + 
              3 * Math.pow(1 - t, 2) * t * controlPoint1Y + 
              3 * (1 - t) * Math.pow(t, 2) * controlPoint2Y + 
              Math.pow(t, 3) * targetY;
              
    return { x, y };
  };
  
  // Function to calculate tangent angle at point on bezier curve
  const getBezierTangent = (t: number) => {
    const dx = 3 * Math.pow(1 - t, 2) * (controlPoint1X - sourceX) + 
               6 * (1 - t) * t * (controlPoint2X - controlPoint1X) + 
               3 * Math.pow(t, 2) * (targetX - controlPoint2X);
               
    const dy = 3 * Math.pow(1 - t, 2) * (controlPoint1Y - sourceY) + 
               6 * (1 - t) * t * (controlPoint2Y - controlPoint1Y) + 
               3 * Math.pow(t, 2) * (targetY - controlPoint2Y);
               
    return Math.atan2(dy, dx) * 180 / Math.PI;
  };
  
  for (let i = 1; i <= numLeaves; i++) {
    const t = i / (numLeaves + 1);
    const point = getBezierPoint(t);
    const tangentAngle = getBezierTangent(t);
    const leafAngle = tangentAngle + (i % 2 === 0 ? 45 : -45); // Alternate leaf angles
    
    // Calculate perpendicular offset to place leaves on the vine edge
    const vineThickness = 2; // Half the stroke width (4/2)
    const leafOffset = vineThickness + 6; // Vine edge + leaf radius
    const perpendicularAngle = tangentAngle + (i % 2 === 0 ? 90 : -90); // Perpendicular to vine
    
    // Offset the leaf position to sit on the vine edge
    const offsetX = point.x + Math.cos(perpendicularAngle * Math.PI / 180) * leafOffset;
    const offsetY = point.y + Math.sin(perpendicularAngle * Math.PI / 180) * leafOffset;
    
    leafPositions.push({ 
      x: offsetX, 
      y: offsetY, 
      rotation: leafAngle 
    });
  }

  return (
    <>
      <defs>
        <pattern id={`vine-pattern-${id}`} patternUnits="userSpaceOnUse" width="20" height="4">
          <rect width="20" height="4" fill="#22c55e" opacity="0.3"/>
          <circle cx="5" cy="2" r="1" fill="#16a34a"/>
          <circle cx="15" cy="2" r="1" fill="#16a34a"/>
        </pattern>
        
        {/* Leaf shape as a path */}
        <path
          id={`leaf-shape-${id}`}
          d="M0,0 Q-3,-2 -6,0 Q-3,2 0,0 Q3,-2 6,0 Q3,2 0,0"
          fill="#22c55e"
          stroke="#16a34a"
          strokeWidth="0.5"
        />
        
        {/* Vine texture gradient */}
        <linearGradient id={`vine-gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#16a34a" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#22c55e" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#16a34a" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      
      {/* Main vine path */}
      <path
        id={id}
        style={{
          ...style,
          stroke: `url(#vine-gradient-${id})`,
          strokeWidth: 4,
          fill: 'none',
          strokeDasharray: '8,4',
          strokeLinecap: 'round',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))',
        }}
        className="react-flow__edge-path"
        d={customBezierPath}
        markerEnd={markerEnd}
      />
      
      {/* Leaf decorations along the vine */}
      {leafPositions.map((leaf, index) => (
        <g key={index}>
          {/* Large leaf (3x size) */}
          <ellipse
            cx={leaf.x}
            cy={leaf.y}
            rx="12"
            ry="6"
            fill="#22c55e"
            stroke="#16a34a"
            strokeWidth="1"
            transform={`rotate(${leaf.rotation} ${leaf.x} ${leaf.y})`}
            opacity="0.8"
          />
          
          {/* Leaf vein */}
          <line
            x1={leaf.x - 6}
            y1={leaf.y}
            x2={leaf.x + 6}
            y2={leaf.y}
            stroke="#16a34a"
            strokeWidth="1"
            transform={`rotate(${leaf.rotation} ${leaf.x} ${leaf.y})`}
            opacity="0.6"
          />
          
          {/* Secondary leaf vein */}
          <line
            x1={leaf.x - 3}
            y1={leaf.y - 2}
            x2={leaf.x + 3}
            y2={leaf.y + 2}
            stroke="#16a34a"
            strokeWidth="0.5"
            transform={`rotate(${leaf.rotation} ${leaf.x} ${leaf.y})`}
            opacity="0.4"
          />
          
          <line
            x1={leaf.x - 3}
            y1={leaf.y + 2}
            x2={leaf.x + 3}
            y2={leaf.y - 2}
            stroke="#16a34a"
            strokeWidth="0.5"
            transform={`rotate(${leaf.rotation} ${leaf.x} ${leaf.y})`}
            opacity="0.4"
          />
        </g>
      ))}
      
      {/* Relationship label with leaf background */}
      {label && (
        <g>
          {/* Leaf-shaped background for label */}
          <ellipse
            cx={labelX}
            cy={labelY}
            rx={String(label).length * 3 + 8}
            ry="12"
            fill="#dcfce7"
            stroke="#22c55e"
            strokeWidth="1"
            opacity="0.9"
          />
          
          {/* Label text */}
          <text
            x={labelX}
            y={labelY}
            className="react-flow__edge-text"
            style={{
              fontSize: '11px',
              fontWeight: '600',
              fill: '#15803d',
              textAnchor: 'middle',
              dominantBaseline: 'central',
            }}
          >
            {label}
          </text>
        </g>
      )}
    </>
  );
}
